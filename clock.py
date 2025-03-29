import tkinter as tk
from time import strftime

def update_time():
    time_string = strftime('%H:%M:%S')
    label.config(text=time_string)
    label.after(1000, update_time)  # Actualiza cada segundo

# Crear ventana
root = tk.Tk()
root.title("Reloj Digital")

# Configurar etiqueta
label = tk.Label(root, font=('Arial', 50), background='black', foreground='cyan')
label.pack(anchor='center')

# Iniciar actualización de la hora
update_time()

# Ejecutar la aplicación
root.mainloop()