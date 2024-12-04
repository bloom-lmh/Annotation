# 简介
## 什么是 Annotation
Annotation是一款轻量级的支持定制化的注释生成插件，能够快速的通过命令为你的ts或js文件中的类、方法和属性生成满足 [jsdoc](https://jsdoc.bootcss.com/)风格的注释，让你在开发中有飞一般的体验。
## 特色功能
Annotation参考了市面上热门的注释生成插件，如IEAD中Easy Javadoc的和VSCODE中的koroFileHeader插件，并结合了他们的优点而诞生。无论你是后端程序员还是前端程序员，都能让你在开发中有熟悉的感觉。其功能包括
- 快捷键生成类的注释
- 快捷键生成方法的注释
- 快捷生成属性注释
- 进行个性化配置
  - 如对类、方法、属性注释元素进行配置
  - 自定义翻译接口
- 支持配置的迁移和复用，让你无论在什么设备上都可以使用自己习惯的注释生成方式
## Annotation类图
![alt text](https://s3.bmp.ovh/imgs/2024/12/04/ccc54c3dbece7a6f.png)
## Annotation架构图
![alt text](https://s3.bmp.ovh/imgs/2024/12/04/73496b02445480a8.png)
# 起步
## 下载
Annotation的使用非常简单，只需要在VSCODE插件市场上搜索annotation插件下载即可，真正的做到了开箱即用。
>:exclamation::exclamation::exclamation:但是注意当前Annotation只能支持最新的VSCODE版本，对低版本的VSCODE的兼容处理还在进行
>中。当然也希望用户更新最新的VSCODE来使用，这样或许有更好的体验，[VSCODE官网](https://code.visualstudio.com/)。

## 使用
Annotation的使用十分简单，只需要将光标对准类、方法或属性然后按下`alt+\`即可生成块级注释
### 生成类注释
![alt text](https://s3.bmp.ovh/imgs/2024/11/28/37f283b0a9c7c38b.gif)
### 生成方法注释
![alt text](https://s3.bmp.ovh/imgs/2024/11/28/3b13cd429a57bacd.gif)
### 生成属性注释
![alt text](https://s3.bmp.ovh/imgs/2024/11/28/e4e89e41ac1c041f.gif)
>注意：在生成注释的时候需要先保存文件，否则无法进行选中

# 配置
## 约定大于配置
Annotation支持用户个性化的配置，但是为了开箱即用，Annotation对常用的选项进行了默认设置。用户不必进行过多的配置或者可以不需要进行配置就能享受到目前市面上最流行的注释方式。
## 支持的配置形式
当然如果你想进行配置，Annotation支持如下两种配置方式
### VSCODE内部配置
Annotation支持直接在VSCODE内部进行直接配置
```json
/* annotation配置 start*/
"annotation.globalSetting": {
  // 作者
  "author": "author name",
  // 作者邮箱
  "email": "your email",
  // 作者电话
  "tel": "your telephone",
  // 描述信息
  "description": "the description about class method or property"
  // 注释添加时间
  "dateTime": "YYYY-MM-DD hh:mm:ss",
  // 类或方法版本号
  "version": "the method or class version"
},
"annotation.classSetting": {
  // 是否开启描述 默认为开启 配置false则关闭
  "description": true
},
"annotation.methodSetting": {
  // 是否开启参数 默认为开启
  "parameters": true,
  // 是否开启返回值 默认为开启
  "returnType": true,
  // 是否开启抛出异常 默认为开启 配置false则关闭
  "throwErrors": true,
  // 是否开启描述 默认为开启 配置false则关闭
  "description": true
},
"annotation.propertySetting": {
  // 是否开启属性类型 默认开启
  "propertyType": true
},
"annotation.translationSetting": {
  // 是否开启翻译 默认开启 配置false则关闭
  "open": true,
  // 用户自定义的单词映射库（预开发功能还没生效）
  "wordMaps": {
    "i": "接口",
    "map": "映射"
  },
  // 用户自定义翻译接口秘钥 可以是数组形式也可以是单个api字符串
  "apiKey": ["秘钥"]
},
```
### JSON文件配置
Annotation支持配置多元化，这样可以尽可能的保证用户配置生效。Annotation支持目前最常见的基于json格式的配置方式，你只需要在项目根目录下添加`annotation.config.json`配置文件即可进行配置了。配置格式和VSCODE内部配置格式一致
```json
{
  "globalConfig": {
    // ...
  },
  "classConfig": {
    // ...
  },
  "methodConfig": {
   // ...
  },
  "propertyConfig": {},
  "translationConfig": {}
}
```
## 配置优先级
通常来说，当你既定义了VSCODE的配置又定义本地项目的json配置，那么本地项目的json配置会覆盖掉VSCODE中相同的配置。当然如果你什么都不进行配置，那么插件将使用默认配置。
也就是说 `annotation.config.json` > `vscode配置` > `默认配置`
## 部分继承
全局配置默认是不会进行生效的，对于全局配置的使用需要方法或类进行部分继承才能生效，也就是使用`"partialExtend"`字段来进行部分继承，使用如下：
```json
{
  "globalConfig": {
    "author": "ccf",
    "email": "1357526355@qq.com",
    "tel": "15520513797",
    "dateTime": "YYYY-MM-DD hh:mm:ss",
    "version": "1.0.1",
    "description": "描述点什么"
  },
  "classConfig": {
    "partialExtend": ["author", "version"]
  },
  "methodConfig": {
    "partialExtend": ["dateTime", "version"]
  },
  "propertyConfig": {},
  "translationConfig": {
    "open": true,
    "apiKey": [
      "G3spRPsvd9ZmSSGykVSD",
      "MqENgg3NeMirAsnEpa4z",
      "3qDhjpKw5GaCi2HohyFi",
      "cAirtriojQobuTu9Yre2",
      "aFF6HMrj3MtObnO4X3hs",
      "0zbtxTxstrLwQ9uK2PuR"
    ]
  }
}
```

# 维护与支持
目前Annotation版本为1.0.3，还有一些BUG还没有暴露，所以后续我会对插件进行更充分的测试，并对出现的BUG进行维护。
项目源码已经放到github上，希望大家可以为我提出一些建议，我会根据建议进行改进。
[Github地址](https://github.com/bloom-lmh/Annotation)
如果喜欢的朋友也可以为我点点赞，这也是我前进的动力。