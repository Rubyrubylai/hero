class ValueError extends Error {
	constructor(message) {
	  super(message)
	  this.code = 400
	  this.message = message
	}
}

class PermissionDenied extends Error {
	constructor(message) {
	  super(message)
	  this.code = 401
	  this.message = message
	}
}

class NotFound extends Error {
	constructor(message) {
	  super(message)
	  this.code = 404
	  this.message = message
	}
}

module.exports = {
	ValueError,
	PermissionDenied,
	NotFound,
}
