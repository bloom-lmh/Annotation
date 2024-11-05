# 开发日志
## 2024/10/25
1. 知识储备
  - 学习vscode插件开发文档
  - 学习Git提交代码以及分支管理
### 2024/10/26

1. 开发环境准备：
   - 安装了GIt，使用GIt进行版本控制和代码提交
   - 搭建了GitHub仓库
   - 安装Generator-code：Generator-code是一个生成器，专门用于创建和管理VS Code扩展。
2. 搭建项目结构
   - 使用npm install -g yo generator-code创建了项目
   - 建立开发分支dev1.0.0
   - 提交项目到了GitHub
3. 遇到问题
   - Git使用不够熟练，特别是在远程分支同步以及分支合并上
4. 解决方案
   - 查询Git使用教程

## 2024/10/27

1. 目标：项目架构

   - 实现通过快捷键激活命令

   - 添加注释类与用户注释配置相映射

   - 添加注释装饰器类，目标功能为实现向类和方法添加注释


   - 添加拾取器获取光标所在上下文
   - 添加解析器，解析拾取器获取的文档生成注释

2. 实现

   - 拾取器：拾取器主要的任务在于拾取上下文对象用于后续注释生成，拾取完成后返回包含拾取信息的上下文对象
     1. 拾取的是方法，则需要拾取完整的方法，包括方法权限、方法名、方法返回值、方法抛出异常
     2. 拾取的是类，则仅仅需要拾取到类名结束
     3. 两者都不是则不进行拾取
     4. 拾取完成后还要判断拾取的内容上方情况，为了后续的注释插入

   - 解析器：解析器的任务在与根据拾取器放回的上下文对象建立实际的注释映射
     1. 利用正则表达式提取类名、方法权限、方法名、方法返回值、方法抛出异常等要在注释中展示的内容
     2. 加载配置，实现用户定制内容，包括日期格式、名字映射等
        最终生成注释对象
   - 注释对象：注释对象是实际注释的抽象，包含注释的位置，内容等信息，并有注释生成方法最终实现注释的生成

3. 问题所在：

   - 应该减轻拾取器的负担，它有太多的职责
   - 正则表达式有局限性，因为方法类型太多无法完成匹配

4. 问题分析
   - 使用AST语法树代替正则表达式

## 2024/10/28

1. 目标
   - 拾取器拾取实现到文件信息，单词信息，行号
   - 通过AST识别出方法、类、属性等信息
2. 实现途径
   - 调用vscodeAPI来完成信息的拾取需要的信息
   - 通过Typescript来编译器API来讲ts文件解析为AST语法树然后遍历节点获取节点信息
3. 遇到问题
   - Typescript编译器API太过于复杂，学习成本很高
   - 保存后的文件信息行号发生变动，导致注释冲突
4. 解决方案
   - 寻找typescript的编译器封装库来完成，减轻开发负担，这里找到的是ts-morph

5. 已经能够实现了完成根据名字识别出具体信息然后生成基本的jsDoc风格的注释了

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

## 2024/11/2
完成基本的注释生成

## 2024/11/3
引入翻译接口,以及配置加载器进行配置的加载，实现个性化定制
翻译采用的是聚合翻译，能够切换谷歌翻译百度翻译等

## 2024/11/4
加载用户配置，要明确用户有哪些配置如何进行配置，支持的配置文件格式有哪些
提供js和ts的配置文件代替json后缀的配置文件，因为json配置文件想要有提示需要借助语言服务器？
js和ts方案失败，尝试搭建语言服务器

## 2024/11/5
先实现基于vscode的配置再实现利用语言服务器实现js和ts的配置
配置优先级：用户ts配置>用户js配置>用户配置json配置>vscode配置
会进行配置合并然后返回