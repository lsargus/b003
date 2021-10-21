export function sendPosBody(x, y, codParte) {

  fetch('http://127.0.0.1:5000/testePost', {  
    method: 'POST',  
    headers: {    
      Accept: 'application/json',    
      'Content-Type': 'application/json'  
    },  
    body: JSON.stringify({    
      codBody: codParte,    
      x: x,
      y: y
    })
  });

}