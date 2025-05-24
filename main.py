# main.py
# Dependencies:
# 1. Kivy: pip install kivy
# 2. python-vlc: pip install python-vlc
# 3. Plyer: pip install plyer
# 4. Mutagen: pip install mutagen
#
# IMPORTANT: `python-vlc` requires that VLC media player is installed on your system.
# FONT FILES: For custom fonts to work, place 'RobotoCondensed-Regular.ttf'
# and 'RobotoCondensed-Bold.ttf' in the same directory as this script, or install them system-wide.

import kivy
kivy.require('2.1.0')

from kivy.app import App
from kivy.core.window import Window
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.modalview import ModalView
from kivy.properties import StringProperty, ObjectProperty, NumericProperty, BooleanProperty, ListProperty, ColorProperty
from kivy.clock import Clock
from kivy.utils import platform, get_color_from_hex
from kivy.core.text import LabelBase

import vlc
import os
from urllib.parse import urlparse, unquote

# Mutagen for tag editing
try:
    import mutagen
    from mutagen.easyid3 import EasyID3, EasyID3KeyError
    from mutagen.id3 import ID3NoHeaderError
except ImportError:
    mutagen = None; EasyID3 = None; EasyID3KeyError = None; ID3NoHeaderError = None
    print("Mutagen not found. Tag editing will not be available. Install with: pip install mutagen")

# Plyer for file chooser
if platform in ('macosx', 'linux', 'win'):
    try:
        from plyer import filechooser
    except ImportError:
        filechooser = None
        print("Plyer not found. File dialog will not work. Install with: pip install plyer")
else:
    filechooser = None
    print(f"Plyer filechooser not supported on platform: {platform}. File dialog will not work.")

# --- Font Registration ---
script_dir_path = os.path.dirname(os.path.abspath(__file__))
try:
    LabelBase.register(name='RobotoCondensed-Regular', fn_regular=os.path.join(script_dir_path, 'RobotoCondensed-Regular.ttf'))
    LabelBase.register(name='RobotoCondensed-Bold', fn_regular=os.path.join(script_dir_path, 'RobotoCondensed-Bold.ttf'))
    INITIAL_DEFAULT_FONT = 'RobotoCondensed-Regular'
    INITIAL_DEFAULT_FONT_BOLD = 'RobotoCondensed-Bold'
    print("Roboto Condensed fonts registered successfully.")
except Exception as e:
    print(f"Could not load Roboto Condensed fonts from {script_dir_path}: {e}. Using Kivy default.")
    INITIAL_DEFAULT_FONT = 'Roboto' 
    INITIAL_DEFAULT_FONT_BOLD = 'Roboto'


class EditTagsModalView(ModalView):
    edit_title = StringProperty(''); edit_artist = StringProperty(''); edit_album = StringProperty('')
    edit_genre = StringProperty(''); edit_year = StringProperty('')
    pass

class EQModalView(ModalView):
    pass

class PlaylistEntry(BoxLayout):
    path = StringProperty(""); text = StringProperty(""); is_selected = BooleanProperty(False)
    index = NumericProperty(0); main_player_window = ObjectProperty(None)
    def on_release_button(self):
        if self.main_player_window: self.main_player_window.load_track_by_index(self.index)

class MainPlayerWindow(BoxLayout):
    track_title_label_text = StringProperty("No file loaded")
    artist_label_text = StringProperty("Artist"); album_label_text = StringProperty("Album")
    genre_label_text = StringProperty("Genre"); year_label_text = StringProperty("Year")
    album_art_source = StringProperty(os.path.join(script_dir_path,'default_album_art.png'))

    play_pause_button_text = StringProperty("Play"); current_volume = NumericProperty(70)
    time_label_text = StringProperty("00:00 / 00:00"); seek_slider_value = NumericProperty(0)
    seek_slider_max = NumericProperty(100)

    player = ObjectProperty(None, allownone=True); vlc_instance = ObjectProperty(None, allownone=True)
    current_media_path = StringProperty(""); current_media_obj = ObjectProperty(None, allownone=True)
    is_playing_vlc = BooleanProperty(False)
    
    playlist = ListProperty([]); playlist_view_data = ListProperty([])
    current_track_index = NumericProperty(-1)

    _vlc_event_manager = None; _is_seeking_manually = False

    eq_instance = ObjectProperty(None, allownone=True); equalizer_enabled = BooleanProperty(False)
    eq_preset_names = ListProperty([]); current_preset_name = StringProperty("Flat")
    eq_band_count = NumericProperty(0); eq_band_frequencies = ListProperty([])

    _eq_modal = ObjectProperty(None, allownone=True); _edit_tags_modal = ObjectProperty(None, allownone=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._update_playlist_view_event = Clock.create_trigger(self._update_playlist_view_actual)
        self.bind(playlist=self._update_playlist_view_event, current_track_index=self._update_playlist_view_event)
        
        self.eq_instance = vlc.AudioEqualizer()
        self.eq_band_count = vlc.libvlc_audio_equalizer_get_band_count()
        presets_count = vlc.libvlc_audio_equalizer_get_preset_count()
        self.eq_preset_names = ["Flat"]
        for i in range(presets_count):
            preset_name_ptr = vlc.libvlc_audio_equalizer_get_preset_name(i)
            if preset_name_ptr: self.eq_preset_names.append(vlc.bytes_to_str(preset_name_ptr))
        for i in range(self.eq_band_count):
            self.eq_band_frequencies.append(round(vlc.libvlc_audio_equalizer_get_band_frequency(i)))
        
        default_art_path = os.path.join(script_dir_path,'default_album_art.png')
        if not os.path.exists(default_art_path):
             print(f"Warning: Default album art '{default_art_path}' not found. Using Kivy icon.")
             self.album_art_source = 'data/logo/kivy-icon-256.png'
        else:
            self.album_art_source = default_art_path

    def set_vlc_player(self, player, instance):
        self.player = player; self.vlc_instance = instance
        if self.player:
            self.player.audio_set_volume(int(self.current_volume))
            self._vlc_event_manager = self.player.event_manager()
            events_to_attach = [
                vlc.EventType.MediaPlayerEndReached, self.handle_media_end_reached,
                vlc.EventType.MediaPlayerTimeChanged, self.handle_media_time_changed,
                vlc.EventType.MediaPlayerPositionChanged, self.handle_media_position_changed,
                vlc.EventType.MediaPlayerLengthChanged, self.handle_media_length_changed,
                vlc.EventType.MediaMetaChanged, self.handle_media_meta_changed,
                vlc.EventType.MediaParsedChanged, self.handle_media_parsed_changed
            ]
            for i in range(0, len(events_to_attach), 2):
                self._vlc_event_manager.event_attach(events_to_attach[i], events_to_attach[i+1])
            if self.equalizer_enabled: self.player.set_equalizer(self.eq_instance)
            else: self.player.set_equalizer(None)

    def _update_playlist_view_actual(self, *args):
        self.playlist_view_data = [{'text': os.path.basename(p), 'path': p, 'is_selected': i == self.current_track_index, 'index': i, 'main_player_window': self} for i, p in enumerate(self.playlist)]

    def open_file_dialog(self):
        if filechooser:
            try:
                selection = filechooser.open_file(title="Pick an MP3 file(s)..", filters=[("MP3 files", "*.mp3")], multiple=True)
                if selection:
                    for fp in selection:
                        if fp not in self.playlist: self.playlist.append(fp)
                    if self.current_track_index == -1 and self.playlist: self.load_track_by_index(0)
            except Exception as e: print(f"Error filechooser: {e}")
        else: print("File chooser not available.")

    def open_folder_dialog(self):
        if filechooser:
            try:
                path = filechooser.choose_dir(title="Pick a folder..")
                if path and path[0] and os.path.isdir(path[0]):
                    added = False
                    for r, _, fs in os.walk(path[0]):
                        for f in fs:
                            if f.lower().endswith(".mp3"):
                                fp = os.path.join(r, f);
                                if fp not in self.playlist: self.playlist.append(fp); added = True
                    if added and self.current_track_index == -1 and self.playlist:
                        idx = next((i for i, p_ in enumerate(self.playlist) if p_.startswith(path[0])), -1)
                        if idx != -1: self.load_track_by_index(idx)
            except Exception as e: print(f"Error folder chooser: {e}")
        else: print("Directory chooser not available.")

    def load_track_by_index(self, index, auto_play=True):
        if not (0 <= index < len(self.playlist)): print(f"Err: Track idx {index} out of bounds."); return
        self.current_track_index = index; file_path = self.playlist[index]
        self.current_media_path = file_path
        if self.player.is_playing(): self.player.stop()
        
        self.current_media_obj = self.vlc_instance.media_new(file_path)
        self.player.set_media(self.current_media_obj)
        self.current_media_obj.parse_with_options(vlc.MediaParseFlag.local, -1)
        
        self.track_title_label_text = os.path.basename(file_path) 
        self.artist_label_text = "Artist"; self.album_label_text = "Album"
        self.genre_label_text = "Genre"; self.year_label_text = "Year"
        self.album_art_source = os.path.join(script_dir_path,'default_album_art.png')

        if self.equalizer_enabled: self.player.set_equalizer(self.eq_instance)
        else: self.player.set_equalizer(None)
        if auto_play: self.play_audio()
        else: self.update_play_pause_button_text()

    def handle_media_meta_changed(self, event, *args):
        if not self.current_media_obj: return
        self.track_title_label_text = self.current_media_obj.get_meta(vlc.Meta.Title) or os.path.basename(self.current_media_path or "Unknown Title")
        self.artist_label_text = self.current_media_obj.get_meta(vlc.Meta.Artist) or "Unknown Artist"
        self.album_label_text = self.current_media_obj.get_meta(vlc.Meta.Album) or "Unknown Album"
        self.genre_label_text = self.current_media_obj.get_meta(vlc.Meta.Genre) or "Unknown Genre"
        date_str = self.current_media_obj.get_meta(vlc.Meta.Date)
        self.year_label_text = date_str.split('-')[0] if date_str and '-' in date_str else (date_str or "Unknown Year")
        
        artwork_url = self.current_media_obj.get_meta(vlc.Meta.ArtworkURL)
        if artwork_url:
            parsed_url = urlparse(artwork_url)
            if parsed_url.scheme == 'file':
                artwork_path = os.path.abspath(unquote(parsed_url.path))
                if platform == 'win' and artwork_path.startswith('/') and artwork_path[2] == ':': artwork_path = artwork_path[1:]
                self.album_art_source = artwork_path if os.path.exists(artwork_path) else os.path.join(script_dir_path,'default_album_art.png')
            else: self.album_art_source = artwork_url
        else: self.album_art_source = os.path.join(script_dir_path,'default_album_art.png')
        print(f"Metadata updated for: {self.track_title_label_text}")

    def handle_media_parsed_changed(self, event, *args):
        if self.current_media_obj and self.current_media_obj.get_parsed_status() == vlc.MediaParsedStatus.done:
            print("Media parsed, refreshing metadata."); self.handle_media_meta_changed(None)

    def play_audio(self):
        if not self.player.get_media() and self.playlist and self.current_track_index != -1:
            self.load_track_by_index(self.current_track_index); return
        if not self.player.get_media(): print("No media loaded"); self.is_playing_vlc = False; self.update_play_pause_button_text(); return
        if self.player.play() == -1: print(f"Error playing {self.track_title_label_text}"); self.is_playing_vlc = False
        else: print(f"Playing: {self.track_title_label_text}"); self.is_playing_vlc = True
        self.update_play_pause_button_text()

    def toggle_play_pause(self):
        if not self.player.get_media():
            if self.playlist: self.load_track_by_index(self.current_track_index if self.current_track_index != -1 else 0)
            else: self.open_file_dialog()
            return
        self.player.pause(); self.is_playing_vlc = self.player.is_playing(); print("Playback toggled.")
        self.update_play_pause_button_text()

    def stop_audio(self):
        if self.player.is_playing() or self.player.get_media():
            self.player.stop(); self.is_playing_vlc = False
            self.time_label_text = "00:00 / 00:00"; self.seek_slider_value = 0
            print(f"Stopped: {self.track_title_label_text}")
        self.update_play_pause_button_text()

    def play_next_track(self, *args):
        if not self.playlist: return
        self.current_track_index = (self.current_track_index + 1) % len(self.playlist)
        self.load_track_by_index(self.current_track_index)

    def play_previous_track(self):
        if not self.playlist: return
        self.current_track_index = (self.current_track_index - 1 + len(self.playlist)) % len(self.playlist)
        self.load_track_by_index(self.current_track_index)

    def set_volume(self, volume_value):
        self.current_volume = volume_value
        if self.player: self.player.audio_set_volume(int(self.current_volume))

    def update_play_pause_button_text(self, *args): self.play_pause_button_text = "Pause" if self.is_playing_vlc else "Play"
    def handle_media_end_reached(self, event): print("Media end reached."); Clock.schedule_once(self.play_next_track)
    def format_time(self, ms): s = ms // 1000; m, s = divmod(s, 60); return f"{m:02d}:{s:02d}"

    def handle_media_time_changed(self, event):
        if self.player and not self._is_seeking_manually:
            ctms = self.player.get_time(); dms = self.player.get_length()
            if dms > 0: self.seek_slider_value = (ctms / dms) * self.seek_slider_max; self.time_label_text = f"{self.format_time(ctms)} / {self.format_time(dms)}"
            else: self.time_label_text = f"{self.format_time(ctms)} / --:--"

    def handle_media_position_changed(self, event):
        if self.player and not self._is_seeking_manually: self.seek_slider_value = self.player.get_position() * self.seek_slider_max

    def handle_media_length_changed(self, event):
        dms = self.player.get_length(); ctms = self.player.get_time()
        if dms > 0: self.time_label_text = f"{self.format_time(ctms)} / {self.format_time(dms)}"
        else: self.time_label_text = f"{self.format_time(ctms)} / --:--"
        
    def on_seek_slider_touch_down(self, slider_id):
        if self.player and self.player.get_media() and self.player.is_seekable(): self._is_seeking_manually = True

    def on_seek_slider_touch_up(self, slider_id):
        if self.player and self.player.get_media() and self.player.is_seekable() and self._is_seeking_manually:
            target_pos = slider_id.value / self.seek_slider_max; self.player.set_position(target_pos)
            Clock.schedule_once(lambda dt: setattr(self, '_is_seeking_manually', False), 0.2)
        elif self._is_seeking_manually: self._is_seeking_manually = False

    def open_eq_modal(self):
        if not self._eq_modal: self._eq_modal = EQModalView()
        self.populate_eq_sliders()
        if self._eq_modal.ids:
             ids = self._eq_modal.ids
             if ids.get('eq_enable_switch'): ids.eq_enable_switch.active = self.equalizer_enabled
             if ids.get('eq_preset_spinner'): ids.eq_preset_spinner.text = self.current_preset_name
             if ids.get('eq_preamp_slider'): ids.eq_preamp_slider.value = self.eq_instance.get_preamp() if self.eq_instance else 0
        self._eq_modal.open()

    def enable_equalizer(self, active):
        self.equalizer_enabled = active
        if self.player: self.player.set_equalizer(self.eq_instance if active else None)

    def apply_eq_preset(self, preset_name):
        if preset_name == "Flat": self.current_preset_name = "Flat"; self.eq_instance.set_preamp(0); [self.eq_instance.set_amp_at_index(0, i) for i in range(self.eq_band_count)]
        else:
            idx = next((i for i, name_ptr in enumerate(map(vlc.libvlc_audio_equalizer_get_preset_name, range(vlc.libvlc_audio_equalizer_get_preset_count()))) if (vlc.bytes_to_str(name_ptr) if name_ptr else "") == preset_name), -1)
            if idx != -1: new_eq = vlc.AudioEqualizer.new_from_preset(idx); self.eq_instance = new_eq if new_eq else self.eq_instance; self.current_preset_name = preset_name
            else: print(f"Preset {preset_name} not found"); return
        if self.equalizer_enabled and self.player: self.player.set_equalizer(self.eq_instance)
        self.populate_eq_sliders()
        if self._eq_modal and self._eq_modal.ids.get('eq_preamp_slider'): self._eq_modal.ids.eq_preamp_slider.value = self.eq_instance.get_preamp() if self.eq_instance else 0

    def set_eq_band_gain(self, band_idx, gain):
        if self.eq_instance:
            self.eq_instance.set_amp_at_index(float(gain), band_idx); self.current_preset_name = "Custom"
            if self._eq_modal and self._eq_modal.ids.get('eq_preset_spinner'): self._eq_modal.ids.eq_preset_spinner.text = "Custom"
            if self.equalizer_enabled and self.player: self.player.set_equalizer(self.eq_instance)

    def set_eq_preamp_gain(self, gain):
        if self.eq_instance:
            self.eq_instance.set_preamp(float(gain)); self.current_preset_name = "Custom"
            if self._eq_modal and self._eq_modal.ids.get('eq_preset_spinner'): self._eq_modal.ids.eq_preset_spinner.text = "Custom"
            if self.equalizer_enabled and self.player: self.player.set_equalizer(self.eq_instance)
                
    def reset_equalizer_settings(self):
        if self.eq_instance:
            self.eq_instance.set_preamp(0); [self.eq_instance.set_amp_at_index(0, i) for i in range(self.eq_band_count)]
            self.current_preset_name = "Flat"
            if self.equalizer_enabled and self.player: self.player.set_equalizer(self.eq_instance)
            if self._eq_modal:
                if self._eq_modal.ids.get('eq_preset_spinner'): self._eq_modal.ids.eq_preset_spinner.text = "Flat"
                if self._eq_modal.ids.get('eq_preamp_slider'): self._eq_modal.ids.eq_preamp_slider.value = 0
                self.populate_eq_sliders()

    def populate_eq_sliders(self):
        if not self._eq_modal or not self._eq_modal.ids.get('eq_bands_layout') or not self.eq_instance: return
        layout = self._eq_modal.ids.eq_bands_layout; layout.clear_widgets(); layout.rows = self.eq_band_count
        for i in range(self.eq_band_count):
            box = BoxLayout(orientation='horizontal', size_hint_y=None, height=dp(30))
            freq = self.eq_band_frequencies[i] if i < len(self.eq_band_frequencies) else f"B{i+1}"
            lbl = Label(text=f"{freq}Hz", size_hint_x=0.3, font_size='10sp', color=(.8,.8,.8,1), font_name=App.get_running_app().DEFAULT_FONT)
            sld = Slider(min=-20, max=20, value=self.eq_instance.get_amp_at_index(i), size_hint_x=0.7, value_track=True, value_track_color=App.get_running_app().ACCENT_COLOR, cursor_size=(dp(20),dp(20)))
            sld.bind(value=lambda instance, value, index=i: self.set_eq_band_gain(index, value))
            box.add_widget(lbl); box.add_widget(sld); layout.add_widget(box)

    def open_edit_tags_modal(self):
        if not mutagen: print("Mutagen lib not found."); self.ids.track_title_label.text = "Tag editing unavailable"; return
        if not self.current_media_path or not os.path.exists(self.current_media_path): print("No valid file for tag edit."); return
        if not self._edit_tags_modal: self._edit_tags_modal = EditTagsModalView()
        try: audio = EasyID3(self.current_media_path)
        except ID3NoHeaderError: audio = mutagen.File(self.current_media_path, easy=True); audio.add_tags()
        except Exception as e: print(f"Error EasyID3: {e}"); self.ids.track_title_label.text = "Error loading tags"; return
        self._edit_tags_modal.edit_title = audio.get('title', [''])[0]
        self._edit_tags_modal.edit_artist = audio.get('artist', [''])[0]
        self._edit_tags_modal.edit_album = audio.get('album', [''])[0]
        self._edit_tags_modal.edit_genre = audio.get('genre', [''])[0]
        self._edit_tags_modal.edit_year = audio.get('date', [''])[0]
        self._edit_tags_modal.open()

    def save_tags(self):
        if not mutagen or not self._edit_tags_modal or not self.current_media_path: return
        try: audio = EasyID3(self.current_media_path)
        except ID3NoHeaderError: audio = mutagen.File(self.current_media_path, easy=True); audio.add_tags()
        except Exception as e: print(f"Error loading for save: {e}"); return
        
        # Helper to handle empty strings for mutagen (remove tag if empty)
        def set_tag_or_delete(tag_dict, key, value):
            if value: tag_dict[key] = value
            elif key in tag_dict: del tag_dict[key]

        set_tag_or_delete(audio, 'title', self._edit_tags_modal.edit_title)
        set_tag_or_delete(audio, 'artist', self._edit_tags_modal.edit_artist)
        set_tag_or_delete(audio, 'album', self._edit_tags_modal.edit_album)
        set_tag_or_delete(audio, 'genre', self._edit_tags_modal.edit_genre)
        set_tag_or_delete(audio, 'date', self._edit_tags_modal.edit_year) # EasyID3 uses 'date' for year
        
        try: audio.save()
        except Exception as e: print(f"Error saving tags: {e}")
        self._edit_tags_modal.dismiss()
        if self.current_media_obj: self.current_media_obj.parse_with_options(vlc.MediaParseFlag.local, -1) # Re-parse for VLC display

class MP3PlayerApp(App):
    # Global App Colors (accessible in KV via app.COLOR_NAME)
    BG_COLOR = ColorProperty(get_color_from_hex('#101015'))
    PRIMARY_TEXT_COLOR = ColorProperty(get_color_from_hex('#E0E0E0'))
    SECONDARY_TEXT_COLOR = ColorProperty(get_color_from_hex('#A0A0A0'))
    TERTIARY_TEXT_COLOR = ColorProperty(get_color_from_hex('#808080'))
    ACCENT_COLOR = ColorProperty(get_color_from_hex('#00FFFF'))
    BUTTON_BG_COLOR = ColorProperty(get_color_from_hex('#333338'))
    BUTTON_ACCENT_BG_COLOR = ColorProperty(get_color_from_hex('#00FFFF'))
    BUTTON_ACCENT_TEXT_COLOR = ColorProperty(get_color_from_hex('#101015'))
    MODAL_BG_COLOR = ColorProperty(get_color_from_hex('#0A0A0D'))
    INPUT_BG_COLOR = ColorProperty(get_color_from_hex('#18181F'))
    PLAYLIST_ITEM_SELECTED_BG = ColorProperty(get_color_from_hex('#00FFFF'))
    PLAYLIST_ITEM_BG = ColorProperty(get_color_from_hex('#18181F'))
    SLIDER_BG_COLOR = ColorProperty(get_color_from_hex('#202025'))


    DEFAULT_FONT = StringProperty('Roboto') 
    DEFAULT_FONT_BOLD = StringProperty('Roboto')
    eq_preset_names = ListProperty([])

    def build(self):
        Window.borderless = True; Window.size = (400, 700)
        global INITIAL_DEFAULT_FONT, INITIAL_DEFAULT_FONT_BOLD # Use values determined after font registration
        self.DEFAULT_FONT = INITIAL_DEFAULT_FONT
        self.DEFAULT_FONT_BOLD = INITIAL_DEFAULT_FONT_BOLD

        self.vlc_instance = vlc.Instance("--no-video --input-repeat=-1")
        self.player = self.vlc_instance.media_player_new()
        root_widget = MainPlayerWindow()
        root_widget.set_vlc_player(self.player, self.vlc_instance)
        self.eq_preset_names = root_widget.eq_preset_names
        return root_widget

    def on_stop(self):
        if self.root and self.root.player:
            if self.root.player.is_playing(): self.root.player.stop()
            if self.root.player.get_equalizer() is not None: self.root.player.set_equalizer(None)
            self.root.player.release()
        if hasattr(self, 'vlc_instance') and self.vlc_instance: self.vlc_instance.release()
        print("VLC resources released on app stop.")

if __name__ == '__main__':
    MP3PlayerApp().run()
