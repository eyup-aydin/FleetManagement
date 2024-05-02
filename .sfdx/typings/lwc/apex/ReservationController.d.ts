declare module "@salesforce/apex/ReservationController.getReservations" {
  export default function getReservations(): Promise<any>;
}
declare module "@salesforce/apex/ReservationController.createReservation" {
  export default function createReservation(param: {name: any, busId: any, pickupDateTime: any, returnDateTime: any}): Promise<any>;
}
