export class PassengerData {
	constructor(
		private readonly passenger_id: number,
		private readonly first_name: string,
		private readonly last_name: string,
		private readonly address: string,
		private readonly phone: string,
	) {}

	getPassengerId() {
		return this.passenger_id;
	}

	getFirstName() {
		return this.first_name;
	}

	getLastName() {
		return this.last_name;
	}

	getAddress() {
		return this.address;
	}

	getPhone() {
		return this.phone;
	}
}
