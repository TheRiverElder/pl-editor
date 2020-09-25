## 工程数据格式

### name

`name: String` 剧本名称

### id

`id: String` 剧本的唯一编号

### version

`version: String` 剧本版本

### authors

`authors: String` 剧本作者列表

### entry

`entry: String` 剧本入口，即第一个文本段的ID

### data

`data: Object` 数据

---

其中，数据可以包含以下三种数据：

#### 资源

- `name: String` 资源的名称
- `src: String` 资源的实际内容，可能是URL或者巨大的DataURL
- `id: String` 资源的唯一编号
- `mime: String` 资源的MIME类型

#### 角色

- `name: String` 角色的名字
- `id: String` 角色的唯一编号
- `avatar: String` 角色的头像资源ID
- `pic: String` 角色的立绘资源ID
- `noPic: Boolean` 无立绘角色，该角色的立绘将会被忽略

#### 文本段

- `id: String` 文本段的唯一编号
- `title: String` 文本段的标题
- `subtitle: String` 文本段的副标题
- `instructions: Instruction[]` 文本段的指令集，这用来指示引擎如何调度舞台

关于指令，有以下类型：

- `["set_bg", bg]` 设置背景，参数分别为：背景资源ID
- `["add_role", ...roles]` 使得该角色上场，参数分别为：角色ID列表
- `["remove_role", ...roles]` 令该角色下场，参数分别为：角色ID列表
- `["set_line", text, speaker]` 设置当前台词，参数分别为：台词文本，发言者ID
- `["add_option", text, target]` 添加选项，参数分别为：选项文本，目标文本段ID

## 成品剧本数据格式

- `string_address: 8` 字符串池地址
- `string_count: 4` 字符串总数
- `role_address: 8` 角色池地址
- `role_count: 4` 角色总数
- `res_address: 8` 资源池地址
- `res_count: 4` 资源总数
- `name: 4` 剧本名称，在字符串池中的索引
- `id: 4` 剧本的唯一编号，在字符串池中的索引
- `version: 4` 剧本版本，在字符串池中的索引
- `author: 4` 作者，在字符串池中的索引
- `entry: 8` 指令入口，在指令区中的索引
- `strings: 4 + n` 字符串常量池，每个字符串由4byte长度以及内容组成
- `roles: 4 + 4` 角色区，每个角色由4byte名字地址以及4byte立绘地址组成
- `instructions: 1 + n` 指令区，每条指令由1byte指令头以及数个参数组成

关于指令，有以下类型：

- `0x00` 退出
- `0x01` 转跳到指令
- `0x02` 设置台词，参数：字符串池索引(4byte)
- `0x03` 设置发言者，参数：角色池索引(4byte)
- `0x11` 设置背景，参数：资源池索引(4byte)
- `0x12` 设置BGM，参数：资源池索引(4byte)
- `0x21` 角色上场，参数：角色池索引(4byte)
- `0x22` 角色下场，参数：角色池索引(4byte)
- `0x31` 添加选项，参数：文本字符串池偏移量(4byte)，目标指令偏移量(4byte)