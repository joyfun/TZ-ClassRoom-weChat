export function addZero(a = 0) {
	if (typeof +a !== 'number') {
		return '00';
	}
	return ('0' + a).slice(-2);
}

export function timeFilter1(date) {
	var time = new Date(date);
	var newDate =
		time.getFullYear() +
		'年' +
		addZero(time.getMonth() + 1) +
		'月' +
		addZero(time.getDate()) +
		'日' +
		addZero(time.getHours()) +
		':' +
		addZero(time.getMinutes());
	return newDate;
}
export function timeFilter2(date) {
	var time = new Date(date);
	var newDate =
		addZero(time.getMonth() + 1) +
		'月' +
		addZero(time.getDate()) +
		'日' +
		addZero(time.getHours()) +
		':' +
		addZero(time.getMinutes());
	return newDate;
}
export function timeFilter3(date) {
	var time = new Date(+date);
	var newDate = addZero(time.getMonth() + 1) + '月' + addZero(time.getDate()) + '日';
	return newDate;
}
export function timeFilter4(date) {
	var time = new Date(date);
	var newDate = addZero(time.getHours()) + ':' + addZero(time.getMinutes());
	return newDate;
}
export function timeFilter5(date) {
	var time = new Date(date);
	var newDate = time.getFullYear() + '年' + addZero(time.getMonth() + 1) + '月' + addZero(time.getDate()) + '日';
	return newDate;
}
