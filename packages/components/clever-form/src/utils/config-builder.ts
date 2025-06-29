/**
 * 配置构建器
 * @description 提供类型安全的配置构建工具，支持链式调用和智能提示
 */

import type {
  FormConfig,
  FieldConfig,
  ContainerConfig,
  GridContainerConfig,
  FlexContainerConfig,
  TabsContainerConfig,
  GroupContainerConfig,
  CardContainerConfig,
  CollapseContainerConfig,
  StepsContainerConfig,
  InlineContainerConfig,
  VerticalContainerConfig,
  ValidationRule,
  ResponsiveConfig
} from '../types'

// 字段构建器
export class FieldBuilder {
  private config: Partial<FieldConfig> = {}

  constructor(field: string, label: string, component: FieldConfig['component']) {
    this.config = { field, label, component }
  }

  /**
   * 设置默认值
   */
  defaultValue(value: any): this {
    this.config.defaultValue = value
    return this
  }

  /**
   * 设置占位符
   */
  placeholder(text: string): this {
    this.config.placeholder = text
    return this
  }

  /**
   * 设置帮助文本
   */
  help(text: string): this {
    this.config.help = text
    return this
  }

  /**
   * 设置必填
   */
  required(required = true): this {
    this.config.required = required
    return this
  }

  /**
   * 设置禁用
   */
  disabled(disabled: boolean = true): this {
    this.config.disabled = disabled
    return this
  }

  /**
   * 设置只读
   */
  readonly(readonly: boolean = true): this {
    this.config.readonly = readonly
    return this
  }

  /**
   * 设置显示条件
   */
  show(condition: boolean): this {
    this.config.show = condition
    return this
  }

  /**
   * 设置组件属性
   */
  props(props: Record<string, any>): this {
    this.config.props = { ...this.config.props, ...props }
    return this
  }

  /**
   * 设置验证规则
   */
  rules(rules: FieldConfig['rules']): this {
    this.config.rules = rules
    return this
  }

  /**
   * 添加验证规则
   */
  addRule(rule: ValidationRule): this {
    if (!this.config.rules) {
      this.config.rules = []
    }
    this.config.rules.push(rule)
    return this
  }

  /**
   * 设置选项（适用于选择类组件）
   */
  options(options: Array<{ label: string; value: any; disabled?: boolean }>): this {
    return this.props({ options })
  }

  /**
   * 设置响应式配置
   */
  responsive(config: FieldConfig['responsive']): this {
    this.config.responsive = config
    return this
  }

  /**
   * 构建配置
   */
  build(): FieldConfig {
    return this.config as FieldConfig
  }
}

// 容器构建器基类
export abstract class ContainerBuilder<T extends ContainerConfig = ContainerConfig> {
  protected config: Partial<T> = {} as Partial<T>
  protected childrenList: Array<FieldConfig | ContainerConfig> = []

  constructor(type: T['type']) {
    this.config.type = type
  }

  /**
   * 设置标题
   */
  title(title: string): this {
    this.config.title = title
    return this
  }

  /**
   * 设置描述
   */
  description(description: string): this {
    this.config.description = description
    return this
  }

  /**
   * 设置显示条件
   */
  show(condition: boolean): this {
    this.config.show = condition
    return this
  }

  /**
   * 设置容器属性
   */
  props(props: Record<string, any>): this {
    this.config.props = { ...this.config.props, ...props }
    return this
  }

  /**
   * 添加字段
   */
  addField(field: FieldConfig | FieldBuilder): this {
    const fieldConfig = field instanceof FieldBuilder ? field.build() : field
    this.childrenList.push(fieldConfig)
    return this
  }

  /**
   * 添加容器
   */
  addContainer(container: ContainerConfig | ContainerBuilder): this {
    const containerConfig = container instanceof ContainerBuilder ? container.build() : container
    this.childrenList.push(containerConfig)
    return this
  }

  /**
   * 批量添加子项
   */
  children(items: Array<FieldConfig | ContainerConfig | FieldBuilder | ContainerBuilder>): this {
    items.forEach(item => {
      if (item instanceof FieldBuilder) {
        this.addField(item)
      } else if (item instanceof ContainerBuilder) {
        this.addContainer(item)
      } else if ('field' in item) {
        this.addField(item as FieldConfig)
      } else {
        this.addContainer(item as ContainerConfig)
      }
    })
    return this
  }

  /**
   * 构建配置
   */
  build(): T {
    this.config.children = this.childrenList
    return this.config as T
  }
}

// 网格布局构建器
export class GridBuilder extends ContainerBuilder<GridContainerConfig> {
  constructor() {
    super('grid')
  }

  /**
   * 设置列数
   */
  cols(cols: number | ResponsiveConfig): this {
    return this.props({ cols })
  }

  /**
   * 设置行间距
   */
  rowGap(gap: number | string): this {
    return this.props({ rowGap: gap })
  }

  /**
   * 设置列间距
   */
  colGap(gap: number | string): this {
    return this.props({ colGap: gap })
  }

  /**
   * 设置网格项属性
   */
  itemProps(itemProps: {
    span?: number | ResponsiveConfig
    offset?: number | ResponsiveConfig
    rowSpan?: number
    colSpan?: number
    align?: 'start' | 'center' | 'end' | 'stretch'
    justify?: 'start' | 'center' | 'end' | 'stretch'
  }): this {
    return this.props({ itemProps })
  }
}

// 弹性布局构建器
export class FlexBuilder extends ContainerBuilder<FlexContainerConfig> {
  constructor() {
    super('flex')
  }

  /**
   * 设置主轴方向
   */
  direction(direction: 'row' | 'column' | 'row-reverse' | 'column-reverse'): this {
    return this.props({ direction })
  }

  /**
   * 设置主轴对齐
   */
  justify(justify: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'): this {
    return this.props({ justify })
  }

  /**
   * 设置交叉轴对齐
   */
  align(align: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'): this {
    return this.props({ align })
  }

  /**
   * 设置换行
   */
  wrap(wrap: 'nowrap' | 'wrap' | 'wrap-reverse'): this {
    return this.props({ wrap })
  }

  /**
   * 设置间距
   */
  gap(gap: number | string): this {
    return this.props({ gap })
  }
  /**
   * 设置flex
   */
  flex(flex: number | string): this {
    return this.props({ flex })
  }

  /**
   * 设置为列布局
   */
  column(): this {
    return this.direction('column')
  }

  /**
   * 设置为行布局
   */
  row(): this {
    return this.direction('row')
  }

  /**
   * 居中对齐
   */
  center(): this {
    return this.justify('center').align('center')
  }
}

// 标签页构建器
export class TabsBuilder extends ContainerBuilder<TabsContainerConfig> {
  constructor() {
    super('tabs')
    this.config.props = { tabs: [] }
  }

  /**
   * 设置标签页类型
   */
  type(type: 'line' | 'card' | 'segment'): this {
    return this.props({ type })
  }

  /**
   * 设置标签页位置
   */
  placement(placement: 'top' | 'right' | 'bottom' | 'left'): this {
    return this.props({ placement })
  }

  /**
   * 添加标签页
   */
  addTab(key: string, label: string, children: Array<FieldConfig | ContainerConfig | FieldBuilder | ContainerBuilder>): this {
    const tabChildren = children.map(child => {
      if (child instanceof FieldBuilder) {
        return child.build()
      } else if (child instanceof ContainerBuilder) {
        return child.build()
      }
      return child as FieldConfig | ContainerConfig
    })

    const tabs = this.config.props?.tabs || []
    tabs.push({ key, label, children: tabChildren })
    return this.props({ tabs })
  }
}

// 表单构建器
export class FormBuilder {
  private config: Partial<FormConfig> = {}

  /**
   * 设置表单ID
   */
  id(id: string): this {
    this.config.id = id
    return this
  }

  /**
   * 设置表单标题
   */
  title(title: string): this {
    this.config.title = title
    return this
  }

  /**
   * 设置表单描述
   */
  description(description: string): this {
    this.config.description = description
    return this
  }

  /**
   * 设置表单模式
   */
  mode(mode: FormConfig['mode']): this {
    this.config.mode = mode
    return this
  }

  /**
   * 设置表单布局
   */
  layout(layout: ContainerConfig | ContainerBuilder): this {
    this.config.layout = layout instanceof ContainerBuilder ? layout.build() : layout
    return this
  }

  /**
   * 设置表单选项
   */
  options(options: FormConfig['options']): this {
    this.config.options = { ...this.config.options, ...options }
    return this
  }

  /**
   * 设置默认数据
   */
  defaultData(data: FormConfig['defaultData']): this {
    this.config.defaultData = data
    return this
  }

  /**
   * 构建配置
   */
  build(): FormConfig {
    if (!this.config.layout) {
      throw new Error('表单布局不能为空')
    }
    return this.config as FormConfig
  }
}

// 工厂函数
export const createField = (field: string, label: string, component: FieldConfig['component']) => {
  return new FieldBuilder(field, label, component)
}

// 分组布局构建器
export class GroupBuilder extends ContainerBuilder<GroupContainerConfig> {
  constructor() {
    super('group')
  }

  /**
   * 设置分组标题
   */
  title(title: string): this {
    return this.props({ title })
  }

  /**
   * 设置是否可折叠
   */
  collapsible(collapsible: boolean): this {
    return this.props({ collapsible })
  }

  /**
   * 设置默认展开状态
   */
  defaultExpanded(defaultExpanded: boolean): this {
    return this.props({ defaultExpanded })
  }

  /**
   * 设置边框
   */
  bordered(bordered: boolean): this {
    return this.props({ bordered })
  }
}

// 卡片布局构建器
export class CardBuilder extends ContainerBuilder<CardContainerConfig> {
  constructor() {
    super('card')
  }

  /**
   * 设置卡片标题
   */
  title(title: string): this {
    return this.props({ title })
  }

  /**
   * 设置卡片大小
   */
  size(size: 'small' | 'medium' | 'large'): this {
    return this.props({ size })
  }

  /**
   * 设置是否显示边框
   */
  bordered(bordered: boolean): this {
    return this.props({ bordered })
  }
}

// 折叠面板构建器
export class CollapseBuilder extends ContainerBuilder<CollapseContainerConfig> {
  constructor() {
    super('collapse')
  }

  /**
   * 设置手风琴模式
   */
  accordion(accordion: boolean): this {
    return this.props({ accordion })
  }

  /**
   * 设置默认展开的面板
   */
  defaultExpandedNames(names: string[]): this {
    return this.props({ defaultExpandedNames: names })
  }

  /**
   * 添加折叠面板
   */
  addPanel(key: string, title: string, children: Array<FieldConfig | ContainerConfig | FieldBuilder | ContainerBuilder>): this {
    const panelChildren = children.map(child => {
      if (child instanceof FieldBuilder) {
        return child.build()
      } else if (child instanceof ContainerBuilder) {
        return child.build()
      }
      return child as FieldConfig | ContainerConfig
    })

    const panel = {
      key,
      title,
      children: panelChildren
    }
    
    this.config.props = this.config.props || {}
    this.config.props.panels = this.config.props.panels || []
    this.config.props.panels.push(panel)
    return this
  }
}

// 步骤布局构建器
export class StepsBuilder extends ContainerBuilder<StepsContainerConfig> {
  constructor() {
    super('steps')
  }

  /**
   * 设置当前步骤
   */
  current(current: number): this {
    return this.props({ current })
  }

  /**
   * 设置步骤方向
   */
  direction(direction: 'horizontal' | 'vertical'): this {
    return this.props({ direction })
  }

  /**
   * 设置步骤大小
   */
  size(size: 'small' | 'medium'): this {
    return this.props({ size })
  }

  /**
   * 添加步骤
   */
  addStep(title: string, children: Array<FieldConfig | ContainerConfig | FieldBuilder | ContainerBuilder>): this {
    const stepChildren = children.map(child => {
      if (child instanceof FieldBuilder) {
        return child.build()
      } else if (child instanceof ContainerBuilder) {
        return child.build()
      }
      return child as FieldConfig | ContainerConfig
    })

    const step = {
      title,
      children: stepChildren
    }
    
    this.config.props = this.config.props || {}
    this.config.props.steps = this.config.props.steps || []
    this.config.props.steps.push(step)
    return this
  }
}

// 行内布局构建器
export class InlineBuilder extends ContainerBuilder<InlineContainerConfig> {
  constructor() {
    super('inline')
  }

  /**
   * 设置间距
   */
  gap(gap: number | string): this {
    return this.props({ gap })
  }

  /**
   * 设置对齐方式
   */
  align(align: 'start' | 'center' | 'end'): this {
    return this.props({ align })
  }

  /**
   * 设置是否换行
   */
  wrap(wrap: boolean | string): this {
    return this.props({ wrap })
  }
}

// 垂直布局构建器
export class VerticalBuilder extends ContainerBuilder<VerticalContainerConfig> {
  constructor() {
    super('vertical')
  }

  /**
   * 设置间距
   */
  gap(gap: number | string): this {
    return this.props({ gap })
  }

  /**
   * 设置对齐方式
   */
  align(align: 'stretch' | 'start' | 'center' | 'end'): this {
    return this.props({ align })
  }
}

export const createGrid = () => new GridBuilder()
export const createFlex = () => new FlexBuilder()
export const createTabs = () => new TabsBuilder()
export const createGroup = () => new GroupBuilder()
export const createCard = () => new CardBuilder()
export const createCollapse = () => new CollapseBuilder()
export const createSteps = () => new StepsBuilder()
export const createInline = () => new InlineBuilder()
export const createVertical = () => new VerticalBuilder()
export const createForm = () => new FormBuilder()

// 常用字段快捷创建函数
export const input = (field: string, label: string) => createField(field, label, 'input')
export const textarea = (field: string, label: string) => createField(field, label, 'textarea')
export const select = (field: string, label: string) => createField(field, label, 'select')
export const radioGroup = (field: string, label: string) => createField(field, label, 'radio-group')
export const checkboxGroup = (field: string, label: string) => createField(field, label, 'checkbox-group')
export const checkbox = (field: string, label: string) => createField(field, label, 'switch')
export const datePicker = (field: string, label: string) => createField(field, label, 'date-picker')
export const switchField = (field: string, label: string) => createField(field, label, 'switch')
export const numberInput = (field: string, label: string) => createField(field, label, 'number-input')
export const inputNumber = (field: string, label: string) => createField(field, label, 'number-input')

// 常用布局快捷创建函数
export const grid = (cols = 1) => createGrid().cols(cols)
export const flex = (direction: 'row' | 'column' = 'row') => createFlex().direction(direction)
export const tabs = (type: 'line' | 'card' | 'segment' = 'line') => createTabs().type(type)