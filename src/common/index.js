import systemTabs from './tabsConst'
import widgetsConst from './widgetsConst'
import cardStates from './cardStates'

export default {
	...cardStates,
	...systemTabs, // array of main tabs
	...widgetsConst // widgets for home
}
