public with sharing class FleetManagementController {

    @AuraEnabled(cacheable = true)
    public static List < Bus__c > getBusList() {
        return [SELECT Id, Name, ImageUrl__c, Year__c, Maximum_Capacity__c, Odometer_Reading__c FROM Bus__c WITH SECURITY_ENFORCED];
    }

    @AuraEnabled
    public static void updateBus(String busId, Map<String, Object> busData) {
        // Convert the received data to a Bus__c sObject
        Bus__c busToUpdate = new Bus__c(Id = busId);
        busToUpdate.Name = (String)busData.get('Name');
        busToUpdate.Odometer_Reading__c = Decimal.valueOf((String)busData.get('Odometer_Reading__c'));
    
        // Perform the update
        try {
            update busToUpdate;
            System.debug('new value of Odometer + '+ busToUpdate.Odometer_Reading__c);
        } catch (DmlException e) {
            // Propagate the exception to the client
            throw new AuraHandledException('Cannot update bus: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable = true)
    public static Decimal getResaleValue(String busId) {
        // Query the Bus record based on the provided busId
        Bus__c bus = [SELECT Id, Year__c, Maximum_Capacity__c, Odometer_Reading__c, Air_Conditioning__c, Current_Status__c FROM Bus__c WHERE Id =: busId WITH SECURITY_ENFORCED];

        // Checking if the bus is ready for use
        if (bus.Current_Status__c != 'Ready for use') {
            return null;
        }

        // Determining the starting selling price based on the number of passengers
        Decimal startingPrice;
        if (bus.Maximum_Capacity__c == 24) {
            startingPrice = 120000;
        } else if (bus.Maximum_Capacity__c == 36) {
            startingPrice = 160000;
        } else {
            return null;
        }

        // Reducing the price by $0.10 for every mile over 100,000 on the odometer
        Decimal mileageReduction = Math.max(bus.Odometer_Reading__c - 100000, 0) * 0.10;
        Decimal resaleValue = startingPrice - mileageReduction;

        // Increasing the starting price by 3% if the bus has air conditioning
        if (bus.Air_Conditioning__c) {
            resaleValue += startingPrice * 0.03;
        }

        // Increasing the starting price by 34% if the bus year is 1972 or older (consider historic)
        if (bus.Year__c <= 1972) {
            resaleValue += startingPrice * 0.34;
        }

        return resaleValue;
    }

}