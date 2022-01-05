import { Component } from "react/cjs/react.production.min";
import {estadoValvula} from "./SimuladorRequest"

class Simulador extends Component{

    constructor() {
        super();

        document.addEventListener('DOMContentLoaded',()=>{


            var tela = document.querySelector("canvas");
            const context = tela.getContext('2d');
        
            tela.width = 700;
            tela.height = 500;
        
            //desenha o quadrado azul 
            context.beginPath();
            context.fillStyle= "blue";
            context.strokeRect(300, 100, 150, 200)
            context.fillRect(300, 100, 150, 200);
            context.closePath();
        
            //cria as linhas horizontais do lado esquerdo
            context.beginPath();
            context.moveTo(80, 125);
            context.lineTo(300, 125);
            context.strokeStyle = "#000";
            context.stroke();
            context.closePath();
        
            //cria as linhas horizontais do lado direito
            context.beginPath();
            context.moveTo(450, 280);
            context.lineTo(650, 280);
            context.strokeStyle = "#000";
            context.stroke();
            context.closePath();
        
        
            context.fillStyle= "black";
            context.beginPath();
            context.moveTo(240,150);
            context.lineTo(199,125);
            context.lineTo(240  ,100);
            context.stroke();
            context.fill();
            context.closePath();
        
            context.fillStyle= "black";
            context.beginPath();
            context.moveTo(160,150);
            context.lineTo(202,125);
            context.lineTo(160,100);
            context.stroke();
            context.fill();
            context.closePath();
        
            context.fillStyle= "black";
            context.beginPath();
            context.moveTo(600,305);
            context.lineTo(559  ,280);
            context.lineTo(600  ,255    );
            context.fill();
            context.closePath();
        
        
            context.fillStyle= "black";
            context.beginPath();
            context.moveTo(520,305);
            context.lineTo(562  ,280);
            context.lineTo(520  ,255);
            context.fill();
            context.closePath();
        
            // desenha um quadradado branco conforme vá decrementando o nivel
            const decrementaNivel = (decremento) =>{
        
                if(decremento <= 200){
                    context.clearRect(300, 100, 150, decremento);   
                    context.closePath(); 
        
                }
        
            }
        
            //Aumenta o quadrado branco conforme vá aumentando
            const aumentaNivel = (aumenta) =>{
        
                if(aumenta >= 200){
                    context.clearRect(300, 100, 150, aumenta);   
                    context.closePath(); 
        
                }
        
            }
        
           // OnV1();
        
        // se a valvula estiver no estado aberto (true), sua representação muda para vermelho
            const valvula1 = (estado) => {
        
                if(estado === true){
        
                    context.fillStyle= "red";
                    context.beginPath();
                    context.moveTo(240,150);
                    context.lineTo(199,125);
                    context.lineTo(240  ,100);
                    context.stroke();
                    context.fill();
                    context.closePath();
                    
                    context.fillStyle= "red";
                    context.beginPath();
                    context.moveTo(160,150);
                    context.lineTo(202,125);
                    context.lineTo(160,100);
                    context.stroke();
                    context.fill();
                    context.closePath();
        
                    aumentaNivel(150);
        
                } 
            }
        
           //var v1 = verficaEStadoValvula();
            valvula1(true);
        
            // se a valvula estiver no estado aberto (true), sua representação muda para vermelho
            const valvula2 = (estado) => {
        
                if(estado === true){
        
                    context.fillStyle= "red";
                    context.beginPath();
                    context.moveTo(600,305);
                    context.lineTo(559  ,280);
                    context.lineTo(600  ,255    );
                    context.stroke();
                    context.fill();
                    context.closePath();
                    
                    context.fillStyle= "red";
                    context.beginPath();
                    context.moveTo(520,305);
                    context.lineTo(562  ,280);
                    context.lineTo(520  ,255);
                    context.stroke();
                    context.fill();
                    context.closePath();
        
                    decrementaNivel(150);
        
                } 
            }
            valvula2(false);
        
        
        
        });
    }
    getCanvas = elem => {
        this.canvas = elem
      }

     
    render(
        ){
    return (
    <div>
        <canvas id="simulador" ref={this.canvas} ></canvas>
    </div>

)
    
    }
    
}



export default Simulador



       
            
