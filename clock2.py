import sys
import time
from PyQt6.QtCore import QTimer, QTime
from PyQt6.QtWidgets import QApplication, QLabel, QWidget

class Reloj(QWidget):
    def __init__(self):
        super().__init__()

        # Configurar la ventana
        self.setWindowTitle("Reloj Digital")
        self.setGeometry(100, 100, 250, 100)

        # Configurar la etiqueta para mostrar la hora
        self.label = QLabel(self)
        self.label.setStyleSheet("font-size: 30px; font-weight: bold; color: yellow; background-color: black;")
        self.label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.label.resize(250, 100)

        # Actualizar el reloj cada segundo
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.actualizar_hora)
        self.timer.start(1000)  # 1000 ms = 1 segundo

        # Mostrar la hora inicial
        self.actualizar_hora()

    def actualizar_hora(self):
        # Obtener la hora actual y actualizar el texto
        hora = QTime.currentTime().toString("HH:mm:ss")
        self.label.setText(hora)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    ventana = Reloj()
    ventana.show()
    sys.exit(app.exec())