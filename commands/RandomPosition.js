const _ = require('underscore');

module.exports = (scope,user) => {
    var User_index = _.findIndex(scope.warPerson,(item)=>{return item.id == user.id })
    var SelectedUser = scope.warPerson[User_index];
    if(scope.AllPosition.length > 0){
        if(SelectedUser != null && SelectedUser.Position == null){
            scope.AllPosition = _.shuffle(scope.AllPosition);
            scope.warPerson[User_index].Position = scope.AllPosition.pop();
            var warPersonThatAlreadyRandomPosition = _.filter(scope.warPerson,(person)=>{
                return person.Position != null;
            });
            var MessagePersonAlreadyRamdom = "";
            _.each(warPersonThatAlreadyRandomPosition,(person,index)=>{
                MessagePersonAlreadyRamdom += (index + 1) +`. <@${person.id}> ตำแหน่ง : **${person.Position.position}**     ไอเท่ม : ${getItemToString(person.Position.item)}     แท่น : ${getItemToString(person.Position.press)}\n`
            });
            var PositionRemaining= ""
            if(scope.AllPosition.length >0){
                PositionRemaining += "\n เหลือ : \n";
                _.each(scope.AllPosition,(item)=>{
                    PositionRemaining += item.position+"\n";
                });
            }
            
            scope.RandomPositionMessage.edit(scope.MessageRandomPosition + MessagePersonAlreadyRamdom + PositionRemaining);
        }
    }
}

function getItemToString (allitem){
    var result = "";
    _.each(allitem,(item,index)=>{
        if(index > 0){
            result += ", ";
        }
        result += String(item);
    });
    return result
}