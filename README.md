# 一款符合jsDoc风格的注释插件
# 开发日志
## 2024/10/25
- 实现了快捷键激活命令
- 添加了注释类与个性化注释配置相映射
- 添加了注释装饰器类，目标功能为实现向类和方法添加注释

## 2024/10/26

- 删除注释装饰器类，增加拾取器类，配置类，解析器类
- 已经可以实现对方法和类的拾取（基于正则），但是上下文对象不够完整
- 正在实现将拾取的方法和类根据配置映射为注释对象

## 2024/10/27

### 上午

明确一些类的职责

#### 拾取器
拾取器主要的任务在于拾取上下文对象用于后续注释生成
1. 拾取的是方法，则需要拾取完整的方法，包括方法权限、方法名、方法返回值、方法抛出异常
2. 拾取的是类，则仅仅需要拾取到类名结束
3. 两者都不是则不进行拾取
4. 拾取完成后还要判断拾取的内容上方情况，为了后续的注释插入
  - 若上方是空行则设置状态为空行状态
  - 若上方是代码，这设置状态为代码状态
  - 若上方是注释，则设置状态为注释状态，并记录注释的开始行和结束行，后续需要删除已有的注释插入新的注释
拾取完成后返回包含拾取信息的上下文对象

#### 解析器
解析器的任务在与根据拾取器放回的上下文对象建立实际的注释映射
1. 利用正则表达式提取类名、方法权限、方法名、方法返回值、方法抛出异常等要在注释中展示的内容
2. 加载配置，实现用户定制内容，包括日期格式、名字映射等
最终生成注释对象

#### 注释对象
注释对象是实际注释的抽象，包含注释的位置，内容等信息，并有注释生成方法最终实现注释的生成

问题所在：应该减轻拾取器的负担，它有太多的职责

### 下午

使用AST语法树代替正则表达式

## 2024/10/28
拾取器拾取到文件信息，单词信息，行号
已经能够通过AST识别出方法、类、属性等信息
下步将会完成根据名字识别出具体信息然后生成注解了

## 2024/10/29
已经基本实现了添加注释功能，但是还有一些bug，以及项目架构的问题需要解决
bug包括
1. 撤销保存时注释会出现问题
2. 若有注释应该删除原来的注释

待开发
1.应该读取配置来决定生成的内容，且允许用户进行配置

## 2024/10/30
对于bug的解决方案
1. 不能添加后自动保存，这是违反直觉的，最好不以次为解决方案
2. 尝试不使用原生的typescript编译器 而使用ts-morph来进行解决，方法注释应该由此工具类来添加
3. 经过验证ts-morph是一个可行的解决方案，使用map来记录生成的注释（测试看是否会因为位置的变动而不能删除），同时对于用户自己添加的注释要与现有注释进行对比看是否要添加
