# TMS: Sede Chilpancingo (TKD Management System)

TMS es una solución integral diseñada para centralizar la administración de alumnos, el control de grados marciales y la gestión financiera de la institución **Tae Kwon Do Olímpico México Chilpancingo**. El sistema optimiza el ciclo de vida del estudiante, desde su ingreso administrativo hasta su progresión técnica en las artes marciales.

## 🚀 Funcionalidades Principales

El sistema se divide en tres módulos estratégicos que garantizan el control total de la academia:

### 1. Gestión Administrativa (ADMIN)

Control absoluto sobre la base de datos de la institución:

- **Expediente Digital:** Registro centralizado de datos personales como nombre, sexo y fecha de nacimiento.
- **Ciclo de Vida:** Gestión del estatus operativo del alumno entre los estados de Activo, Inactivo o Baja.
- **Gestión de Grados:** Seguimiento detallado de la fecha de admisión y el progreso de cintas.
- **Control de Tutoría:** Vinculación obligatoria de un responsable legal para alumnos menores de 18 años.
- **Directorio:** Centralización de números telefónicos de contacto directo o de tutores para emergencias.

### 2. Gestión Dinámica y Edición Masiva

Herramientas avanzadas para automatizar procesos administrativos y operativos:

- **Actualización de Grados por Criterio:** Permite realizar promociones grupales de forma eficiente (ej. promover a todos los Cinta Blanca tras un examen).
- **Modificación Parametrizada de Costos:** Ajuste de montos de colegiatura basado en criterios como edad, antigüedad o convenios.
- **Reclasificación Masiva de Estatus:** Automatización para detectar y cambiar el estado de alumnos inactivos en periodos definidos.
- **Edición Global:** Interfaz para corregir cualquier campo del expediente manteniendo la integridad referencial de la base de datos.

### 3. Portal del Alumno y Finanzas

Interfaz diseñada para la transparencia y consulta del usuario final:

- **Dashboard de Cobranza:** Monitor en tiempo real del estado de colegiatura: Al corriente, Pendiente o Vencido.
- **Historial Financiero:** Consulta detallada de pagos realizados y adeudos pendientes.
- **Perfil de Progreso:** Visualización del grado marcial actual y tiempo acumulado en la institución.

## 🛠️ Stack Tecnológico (SQL-Driven)

Este proyecto prioriza la integridad de datos y utiliza **SQL Puro** para la implementación de la lógica de negocio:

- **Motor de Base de Datos:** PostgreSQL (Uso intensivo de Procedimientos Almacenados y Triggers).
- **Backend:** FastAPI (Python) ejecutando consultas SQL crudas para máximo control.
- **Frontend:** React + Tailwind CSS para una interfaz moderna y responsiva.
- **Seguridad:** Autenticación protegida mediante usuario y contraseña única.

---

**Desarrollado por:** AB Software Group  
**Versión:** 1.1
