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
  Container,
  header,
  Aside,
  Main,
  Input,
  Autocomplete,
  Upload,
  Radio,
  RadioGroup,
  RadioButton,
  DatePicker,
  tag,
  dialog,
  checkbox,
  Form,
  FormItem
} from 'element-ui'

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
    V.use(Container)
    V.use(header)
    V.use(Aside)
    V.use(Main)
    V.use(Autocomplete)
    V.use(DatePicker)
    V.use(Upload)
    V.use(Radio)
    V.use(RadioGroup)
    V.use(RadioButton)
    V.use(DatePicker)
    V.use(tag)
    V.use(dialog)
    V.use(Loading.directive)
    V.use(checkbox)
    V.use(Form)
    V.use(FormItem)

    V.prototype.$loading = Loading.service
    V.prototype.$msgbox = MessageBox
    V.prototype.$alert = MessageBox.alert
    V.prototype.$confirm = MessageBox.confirm
    V.prototype.$prompt = MessageBox.prompt
    V.prototype.$notify = Notification
    V.prototype.$message = Message

    // 注入定制样式的消息提示
    V.prototype.$serverErrNotify = (msg) => {
      Notification.error({
        title: '>...<',
        message: msg || '服务端出小差啦'
      })
    }
  }
}
