<?php  
namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;
use Model\ActiveRecord;

class APIController {
    public static function index() {
        $servicios = Servicio::all();
        echo json_encode($servicios);
        
    }
    public static function guardar(){
        // almacena la cita y devuelve el Id 

        $cita = new Cita($_POST);
        $resultado = $cita->guardar();

        $id = $resultado['id'];

        // Almacena las Citas y Servicios con el Id de la cita
        
        $idServicios = explode(",", $_POST['servicios'] );

        foreach($idServicios as $idServicio) {
            $args = [
                'citaId' => $id,
                'servicioId' => $idServicio
            ];
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        }
        
        // Retornamos una respuesta
        $respuesta = [
            'servicios' => $resultado
        ];

        echo json_encode($respuesta);
    }

    public static function eliminar() {
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $cita = Cita::find($_POST['id']);
            $cita->eliminar();
            header('Location:' . $_SERVER['HTTP_REFERER']);
            
        }
    }
}