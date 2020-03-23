1. Modelado Entidad POI

    Para modelar la entidad POI, se ha decidido incluir en el archivo tripModel.js el esquema "POISchema". 
    Debido al modelado que hemos hecho del objeto Stage (incluido dentro de la colección Trips, en lugar de una colección independiente).
    Me veo imposibilitado a añadir en el atributo "isVisited" el id de Stage. Con lo cual decido añadir un array de Stages en este atributo. 
    Para hacer más fácil el dashboard sobre el número de veces que se visita el POI he añadido el contador "numberOfVisits", 
    que es la longitud del array de stages de "isVisited"
