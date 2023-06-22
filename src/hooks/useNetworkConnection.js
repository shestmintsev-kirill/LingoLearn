import { useNetwork } from '@vueuse/core'
import { useQuasar } from 'quasar'
import { watch } from 'vue'

export default () => {
	const { isOnline } = useNetwork()
	const $q = useQuasar()

	watch(isOnline, (nv) => {
		const connectionWrongBody = {
			message: 'You have lost connection to the internet.',
			boxClass: 'bg-grey-2 text-grey-9',
			spinnerColor: 'red-12'
		}
		if (!nv) $q.loading.show(connectionWrongBody)
		else $q.loading.hide()
	})

	return {}
}
