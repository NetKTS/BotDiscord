const _ = require('underscore');

module.exports = (scope,user) => {
    var User_index = _.findIndex(scope.warPerson,(item)=>{return item.id == user.id })
    var SelectedUser = scope.warPerson[User_index];
    if(scope.AllPosition.length > 0){
        if(SelectedUser != null && SelectedUser.Position == null){
            scope.AllPosition = _.shuffle(scope.AllPosition);
            var SelectedPosition;

            
            // ล็อคหน้าบ้านมัน
            if(scope.warPerson[User_index].id == "310400435678609439"){
                var getIndex = getPosistionIndex(scope.AllPosition,"หน้าบ้านมัน")
                SelectedPosition = scope.AllPosition.splice(getIndex,1).pop();
            }else{
                if(scope.AllPosition[scope.AllPosition.length-1].position == "หน้าบ้านมัน"){
                    SelectedPosition = scope.AllPosition.shift();
                }else{
                    SelectedPosition = scope.AllPosition.pop();
                }
            }
            
            scope.warPerson[User_index].Position = SelectedPosition;
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
function getPosistionIndex (Allposition,PositionName){
    var findindex = Allposition.findIndex((item)=>{return item.position == PositionName})
    if(findindex >= 0){
        return findindex
    }
}