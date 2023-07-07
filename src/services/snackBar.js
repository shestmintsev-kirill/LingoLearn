import { Notify } from 'quasar'

const defaultOptions = {
	position: 'top',
	spinner: false,
	message: '',
	html: true,
	timeout: 6000,
	icon: '',
	actions: [
		{
			icon: 'close',
			color: 'white',
			class: 'q-btn--flat q-btn--round q-btn--dense',
			handler: () => {}
		}
	],
	success: { color: 'green' },
	error: { color: 'red' },
	warning: { color: 'orange' }
}

export default {
	error: (
		message = defaultOptions.message,
		timeout = defaultOptions.timeout,
		spinner = defaultOptions.spinner,
		icon = defaultOptions.icon,
		position = defaultOptions.position,
		customActions = []
	) => {
		Notify.create({
			position: position,
			spinner: spinner,
			message: '<span style="font-size: 16px">' + message + '</span>',
			html: defaultOptions.html,
			timeout: timeout === '' || timeout === null ? defaultOptions.timeout : timeout,
			icon: icon,
			color: defaultOptions.error.color,
			actions: customActions?.length ? customActions : defaultOptions.actions
		})
	},
	success: (
		message = defaultOptions.message,
		timeout = defaultOptions.timeout,
		spinner = defaultOptions.spinner,
		icon = defaultOptions.icon,
		position = defaultOptions.position,
		customActions = []
	) => {
		Notify.create({
			position: position,
			spinner: spinner,
			message: '<span style="font-size: 16px">' + message + '</span>',
			html: defaultOptions.html,
			timeout: timeout === '' || timeout === null ? defaultOptions.timeout : timeout,
			icon: icon,
			color: defaultOptions.success.color,
			actions: customActions?.length ? customActions : defaultOptions.actions
		})
	},
	warning: (
		message = defaultOptions.message,
		timeout = defaultOptions.timeout,
		spinner = defaultOptions.spinner,
		icon = defaultOptions.icon,
		position = defaultOptions.position,
		customActions = []
	) => {
		Notify.create({
			position: position,
			spinner: spinner,
			message: '<span style="font-size: 16px">' + message + '</span>',
			html: defaultOptions.html,
			timeout: timeout === '' || timeout === null ? defaultOptions.timeout : timeout,
			icon: icon,
			color: defaultOptions.warning.color,
			actions: customActions?.length ? customActions : defaultOptions.actions
		})
	}
}
