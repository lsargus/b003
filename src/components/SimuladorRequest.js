

export function estadoValvula() {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    fetch("http://127.0.0.1:5000/estadoVavula", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  
  }