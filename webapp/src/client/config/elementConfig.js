import {
  Rate,
  Row,
  Loading,
  MessageBox,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Notification,
  Message,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Carousel,
  CarouselItem,
  Pagination,
  Step,
  Steps,
  Tabs,
  TabPane,
  Button,
  Table,
  TableColumn,
  Select,
  option,
  Switch,
  Input,
  Dialog,
  Upload,
  Form,
  FormItem,
  InputNumber
} from 'element-ui'
import {
  SERVICE_FAILD
} from '@/client/constants/webapp.js'

export default {
  install (V) {
    V.use(Rate)
    V.use(Button)
    V.use(Row)
    V.use(Menu)
    V.use(Submenu)
    V.use(MenuItem)
    V.use(MenuItemGroup)
    V.use(Dropdown)
    V.use(DropdownMenu)
    V.use(DropdownItem)
    V.use(Carousel)
    V.use(CarouselItem)
    V.use(Pagination)
    V.use(Step)
    V.use(Steps)
    V.use(Tabs)
    V.use(TabPane)
    V.use(Table)
    V.use(TableColumn)
    V.use(Select)
    V.use(option)
    V.use(Switch)
    V.use(Input)
    V.use(Dialog)
    V.use(Upload)
    V.use(Loading.directive)
    V.use(Form)
    V.use(FormItem)
    V.use(InputNumber)

    V.prototype.$loading = Loading.service
    V.prototype.$msgbox = MessageBox
    V.prototype.$alert = MessageBox.alert
    V.prototype.$confirm = MessageBox.confirm
    V.prototype.$prompt = MessageBox.prompt
    V.prototype.$notify = Notification
    V.prototype.$message = Message

    // 注入定制样式的消息提示
    V.prototype.$serverErrNotify = (msg) => {
      console.log(msg)
      Notification.error({
        title: '>...<',
        message: msg || SERVICE_FAILD
      })
    }
  }
}
