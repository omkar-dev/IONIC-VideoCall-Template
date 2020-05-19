import { Component,OnInit } from '@angular/core';
declare var SimplePeer: import('simple-peer').SimplePeer;
import { Socket } from 'ngx-socket-io';
import { scan,} from 'rxjs/operators';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
public  $connection:Observable<any>;
  PeerConnsection: any;

  constructor(
    private socket: Socket

  ) {
   
    
  }



  ngOnInit() {


    var peers = {};
    var useTrickle = true;
    this.socket.on('connect',()=>{
      console.log('Connected to signalling server, Peer ID: %s', this.socket);
     // this.$connection = this.RxfromIO(this.socket, 'peer').pipe(scan((acc, val) => [...acc, val], []));

     this.$connection =  this.RxfromIO(this.socket, 'peer')
     this.PeerConnsection  = this.RxfromIO(this.socket, 'signal')
      this.$connection.subscribe(data=>{
         var peerId = data.peerId;
         var peer = new SimplePeer({ initiator: data.initiator, trickle: useTrickle });
           
         this.PeerConnsection.subscribe(data=>{
           console.log('peer0',data)
           if (data.peerId == peerId) {
             peer.signal(data.signal);
           }
         });
   
   
     peer.on('signal', function(data) {
       console.log('peer',data)
       this.send('signal',{
        signal: data,
        peerId: peerId
      })
     });
   
     peer.on('error', function(e) {
     });
   
     peer.on('connect', function() {
       peer.send("hey peer");
     });
   
     peer.on('data', function(data) {
     });
   
     peers[peerId] = peer;
   
     })





     
   })

  }



  send (event,message): void {
    this.socket.emit(event, message);
  }

RxfromIO(io, eventName) {
  return Observable.create(observer => {
    io.on(eventName, (data) => {
       observer.next(data)
    });
    return {
        dispose : io.close
    }
});
}

}
