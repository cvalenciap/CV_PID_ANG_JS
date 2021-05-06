(function (window) {
  window.__env = window.__env || {};

  // API url
  window.__env.backend_path = 'http://localhost:59592/api/';
  console.log(window.__env.backend_path);

  // Mensajes
  window.__env.help_messages = {
      dni_message: "Ingrese el número de DNI a consultar (8 dígitos)",
      ruc_message: "Ingrese el número de RUC a consultar (11 dígitos)",
      tipo_participante_message: "Seleccione un tipo de participante para realizar la consulta",
      nombres_message: "Ingrese el nombre de la persona a consultar",
      ap_paterno_message: "Ingrese el apellido paterno de la persona a consultar",
      ap_materno_message: "Ingrese el apellido materno de la persona a consultar",
      razo_social_message: "Ingrese la razon social a consultar",
      num_partida_message: "Ingrese el número de partida del título de propiedad registrado",
      oficina_message: "Selecciona el lugar de la oficina donde se inscribio la partida",
      tipo_registro_message: "Seleccione el tipo de registro a consultar",
      start_date_message: "Fecha de inicio del rango para búsqueda de registros",
      end_date_message: "Fecha de fin del rango para búsqueda de registros",
      month_year_message: "Mes y año que en el que se desea saber que consultas se han realizado y cuantas veces"
      //Inicio GMD CVALENCIAP
      ,act_cred_message: "Ingrese la credencial actual",
      new_cred_message: "Ingrese la nueva credencial",
      confnew_cred_message: "Reingrese la nueva credencial"
      //Fin GMD CVALENCIAP
  };

}(this));