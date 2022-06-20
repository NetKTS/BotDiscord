const _ = require('underscore');
const plusEmoji = "🔼"
const minusEmoji = "🔽"

exports.plusScore = (react,user) => {
    if(react.author.bot&& react.content.includes(" vs ")){
        if(react.emoji.name == plusEmoji){
        
        }else if(react.emoji.name == minusEmoji){
    
        }
    }
}