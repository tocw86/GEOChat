import {} from '@types/googlemaps';
export class Map{

    private key:string = 'AIzaSyBfzFAWyEyfFRCkVKzRmPl0fIraX1Ln0_U';
    public map:any;

    initMap(myData:any):void{
        var myPos = {
            lat: myData.lat,
            lng: myData.lng
        };
        this.map = new google.maps.Map(
            document.getElementById('map'), 
            {
                zoom:4,
                center: myPos
             });
        // The marker, positioned at Uluru
        var marker = new google.maps.Marker({position: myPos, map: this.map});
      
    }

    updateMarkers(usersData:any):void{
        
    }

}