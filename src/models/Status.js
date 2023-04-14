const mongoose = require('mongoose')
const statusSchema = new mongoose.Schema({
    sentRequest:[{
		username: {type: String, default: ''}
	}],
	request: [{
		userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Request'},
		username: {type: String, default: ''}
	}],
	recieveRequest: [{
		RecieverName: {type: String, default: ''},
        RecieverId: {type: mongoose.Schema.Types.ObjectId, ref: 'Request'}
	}],
})
const Status = new mongoose.model("Status",statusSchema)
module.exports = Status;
