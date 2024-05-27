export class AirplaneData {
	constructor(
		private readonly airplane_id: number,
		private readonly serial_number: string,
		private readonly manufacturer: string,
		private readonly model: string,
	) {}

	getAirplaneId() {
		return this.airplane_id;
	}

	getSerialNumber() {
		return this.serial_number;
	}

	getManufacturer() {
		return this.manufacturer;
	}

	getModel() {
		return this.model;
	}
}
