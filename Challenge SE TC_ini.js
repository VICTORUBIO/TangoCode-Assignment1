Function 1
exports.getAll = function(event, context, callback) {
    const connection = db.connect(event.stageVariables);
    var query = 'SELECT * FROM Clients ORDER BY' + event.queryStringParameters.sort';
    connection.query(query, function (error, results, fields) {
       if (error) {
           db.close(connection);
           callback(null, {
               statusCode: 205,
				headers: { "Access-Control-Allow-Origin": "*" },               
				body: JSON.stringify(error)
           });
        } else {
            db.close(connection);
            callback(null, {
				statusCode: 200,
				headers: { "Access-Control-Allow-Origin": "*" },               
				body: JSON.stringify(results)
            });
        }
    });  
};

Function 2

const updateClient = function(client, id, connection) {
    return new Promise(function(resolve, reject){
        const query = 'UPDATE Clients SET ? WHERE id = ?';
        connection.query(', [client, id], function (error, results, fields) {
            if (!error) {
                resolve(results);
            }
        });       
    });
};

module.exports = {
  	update = function(event, context, callback) {
	    if (!event.pathParameters.id) {
	        callback(null, {
	            statusCode: 400
	        });
	    } else { 
	        this.body = JSON.parse(event.body);
	        this.connection = db.connect(event.stageVariables);
	        updateClient(this.body, event.pathParameters.id, this.connection)
	        .then(function(results) {
	            db.close(this.connection);
	            callback(null, {
	                statusCode: 201,
	                headers: { "Access-Control-Allow-Origin": "*" },
	                body: JSON.stringify(results)
	            });
	        })
	        .catch(function(error){
	            console.log('error ', error);
	            db.close(this.connection);
	            callback(null, {
	                statusCode: 500,
	                headers: { "Access-Control-Allow-Origin": "*" },
	                body: JSON.stringify(error)
	            });       
	        })       
	    }
	};
}