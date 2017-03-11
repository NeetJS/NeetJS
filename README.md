# NeetJS
NeetJS是一个jQuery插件，它实现了一个轻量级的Web前端MVC框架：

1. 使用纯 HTML、CSS、JavaScript 实现了模块化编程。
2. 在前端动态生成页面，将Web的前后端解耦。
3. 兼容 IE 7/8/9/10/11 和所有现代浏览器。
4. 易于学习。

##获取NeetJS

NeetJS目前尚处于开发和公测阶段，可以从GitHub的master分支检出最新的测试版本：

```
git clone https://github.com/prchen-open/NeetJS.git
```

##MIT License
```
MIT License

Copyright (c) 2016 NeetJS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

# NeetJS教程

* **NeetJS是一个JavaScript库。**
* **NeetJS是一个轻量级前端MVC框架。**
* **NeetJS以jQuery插件的形式工作。**
* **NeetJS主要用于前端生成页面及前端组件的模块化开发。**
* **NeetJS很容易学习。**

---

**在开始前您应具备的知识**

1. HTML
2. JavaScript
3. jQuery
4. AJAX
5. JSON

**如果您了解以下内容将会很有帮助**

1. AppML、AngularJS等具备类似功能的JS库。
2. PHP、Jsp、Jstl等在服务器端动态生成页面的语言或库。

**您将学到的东西**

1. 如何快速地在前端用JSON渲染出页面并在需要时快速地更新页面。
2. Web前后端分离，面向REST接口进行系统测试、系统开发的思想。

---

**本教程将包含很多实例**

教程中大部分实例将以以下的方式呈现。首先，会给出节选的核心代码：

```html
...
<div nt-class="org-neetjs-demo-hello">
<div nt-body>
    <h1>Hello NeetJS!</h1>
    <p>Welcome to use NeetJS tutorial, <span nt-html="title"></span> <span nt-html="name"></span></p>
</div>
</div>
<script type="text/javascript">
$(function () {
    $.neetjs.loadFromBody();
    $('body').ntInject({
        'class': 'org-neetjs-demo-hello',
        'data': {'title': 'Mr.', 'name': 'Chen'}
    });
});
</script>
...
```

然后给出节选的渲染结果并给出一个前往实例演示系统的链接：

```html
...
<h1>Hello NeetJS!</h1>
<p>Welcome to use NeetJS tutorial, <span>Mr.</span> <span>Chen</span></p>
...
```

[亲自试一下](https://neetjs.github.io/demo/#tutorial_case_0)

在实例演示系统中，您将可以修改代码并点击“Submit Code”按钮来查看修改后的效果。

---

## 基础教程

在本部分教程中您将学会：
* 如何在自己的页面中使用NeetJS。
* NeetJS有哪些基础的功能以及怎样使用它们。

概念定义：
* 渲染属性：指附在html标签上，对NeetJS框架有特殊意义的属性。
* 渲染函数：指可以被JS代码调用，让NeetJS框架生成html代码的函数。

---

### NeetJS的代码结构

一个简单的使用了NeetJS的页面结构如下：

* head中引入jQuery和NeetJS。
* 定义页面加载时的初始化流程或一些使用到NeetJS的函数。
* body中写入NeetJS类的定义以及body中的其它内容。

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<!-- Load classes from body when document.ready triggered -->
<meta nt-props="/boot/load-from-body" content="true" />
<script type="text/javascript" src="/res/jquery.min.js"></script>
<script type="text/javascript" src="/res/jquery.neet.js"></script>
<!-- Init process -->
<script type="text/javascript">
$(function () {
    $('.addBtn').click(function () {
        // Call a render method
        $('body').ntAppend({'class': 'org-neetjs-demo-hello'});
    });
});
</script>
<title>Hello NeetJS</title>
</head>
<body>

<!-- Definitions of NeetJS classes -->
<div nt-class="org-neetjs-demo-hello">
<div nt-body>
    <p>Hello NeetJS!</p>
</div>
</div>

<!-- Original body contents -->
<p><button class="addBtn">Add Some Content</button></p>

</body>
</html>
```

上例中，点击几次“Add Some Content”按钮后，body中的结果为：

```html
...
<body>
<p><button class="addBtn">Add Some Content</button></p>
<p>Hello NeetJS!</p>
<p>Hello NeetJS!</p>
<p>Hello NeetJS!</p>
...
</body>
...
```

[亲自试一下](https://neetjs.github.io/demo/#tutorial_case_1)

NeetJS是通过“类”的方式来组织模块的，您也可以将NeetJS的“类”理解为MVC框架中的“视图”或是大部分模板引擎中“模板”的概念。一个NeetJS类的结构如下：
```html
<div nt-class="org-neetjs-demo-hello">
<div nt-head>
    <link rel="stylesheet" type="text/css" href="mycss.css" />
</div>
<div nt-body>
    <p>Hello NeetJS!</p>
</div>
</div>
```

其中，最外面包含nt-class属性的标签声明了名为“org-neetjs-demo-hello”的NeetJS类。每个NeetJS类中分为两个主要的组成部分，即一个带有nt-head属性的标签和一个带有nt-body属性的标签。

带有nt-head属性的标签代表了在使用本类时，HTML的head标签中所需加入的内容，如上例中，便是声明了在“org-neetjs-demo-hello”要使用link标签引入“mycss.css”。

```html
<div nt-head>
    <link rel="stylesheet" type="text/css" href="mycss.css" />
</div>
```

带有nt-body属性的标签代表了类所包含的实体内容的模板。

```html
<div nt-body>
    <p>Hello NeetJS!</p>
</div>
```
---

### NeetJS的调用方式

NeetJS提供了6中将渲染内容插入到页面中的方式，它们分别与jQuery中的一些函数的效果相对应：

```javascript
$(...).ntReplace(option); // use $(...).replace(renderResult)
$(...).ntInject(option);  // use $(...).html(renderResult)
$(...).ntPrepend(option); // use $(...).prepend(renderResult)
$(...).ntAppend(option);  // use $(...).append(renderResult)
$(...).ntBefore(option);  // use $(...).before(renderResult)
$(...).ntAfter(option);   // use $(...).after(renderResult)
```

其中，参数option是一个JS对象，以ntInject为例，介绍一下它的格式：

```javascript
$('body').ntInject({
    'class': 'org-neetjs-demo-mydatatable',
    'data': {
        'studentAmount': '2',
        'studentList': [
            {'studentId': '1', 'name': 'A'},
            {'studentId': '2', 'name': 'B'}
        ]
    }
});
```

option中“class”域会告诉NeetJS我们这次渲染的类是什么，而“data”域则是渲染时使用的数据。这类似于MVC框架中“Controller”层获取数据，将其封装到“Model”中，然后传给“View”层让其渲染出最终的界面的过程。“class”指出“view”的名字，“data”就是传给“view”的“model”。

---

### 输出内容

NeetJS有两种基础的将数据输出到页面中的方式：

* 将内容作为html注入给元素。
* 将内容作为属性注入给元素。

#### nt-html

nt-html可以用于将变量/运算结果作为元素的内部html代码注入给标签：

```html
<div nt-class="org-neetjs-demo-hello">
<div nt-body>
    <h1 nt-html="textHeader"></h1>
    <p nt-html="textContent"></p>
</div>
</div>
<script type="text/javascript">
$(function () {
    $.neetjs.loadFromBody();
    $('body').ntInject({
        'class': 'org-neetjs-demo-hello',
        'data': {'textHeader': 'This is h1.', 'textContent': 'This is p.'}
    });
});
</script>
```

其结果将是：

```html
...
<body>
    <h1>This is h1.</h1>
    <p>This is p.</p>
</body>
...
```

[亲自试一下](https://neetjs.github.io/demo/#tutorial_case_nt_html)

#### nt-attr

nt-attr可以用于将变量/运算结果作为赋值给元素的属性，有两种写法：

```html
<div nt-class="org-neetjs-demo-hello">
<div nt-body>
    <!-- only support single attr -->
    <img nt-attr="'src', '/demo/img/avatar/' + userId + '.png'"/>
    <!-- support multiple attrs -->
    <img nt-attr="{'src': '/demo/img/profile/' + userId + '.png', 'class': imgClass}"/>
</div>
</div>
<script type="text/javascript">
$(function () {
    $.neetjs.loadFromBody();
    $('body').ntInject({
        'class': 'org-neetjs-demo-hello',
        'data': {'userId': '1001', 'imgClass': 'aCssClass'}
    });
});
</script>
```

其结果将是：

```html
...
<body>
    <img src="/demo/img/avatar/1001.png" />
    <img src="/demo/img/profile/1001.png" class="aCssClass"/>
</body>
...
```

[亲自试一下](https://neetjs.github.io/demo/#tutorial_case_nt_attr)

---

### 控制流

正如绝大部分编程语言和模板引擎一样，NeetJS也支持“判断”和“循环”这两种控制流。

#### nt-if & nt-elseif & nt-else

这三种渲染属性可以根据变量/运算结果来判断是否显示/删除属性所在的元素：

```html
<div nt-class="org-neetjs-demo-hello">
<div nt-body>
    <p nt-if="hour <= 12">Good morning</p>
    <p nt-elseif="hour <= 18">Good afternoon</p>
    <p nt-else>Good evening</p>
</div>
</div>
<script type="text/javascript">
$(function () {
    $.neetjs.loadFromBody();
    $('body').ntInject({
        'class': 'org-neetjs-demo-hello',
        'data': {'hour': new Date().getHours()}
    });
});
</script>
```

假设现在是上午10点，那么结果将是：

```html
...
<body>
    <p>Good morning</p>
</body>
...
```

[亲自试一下](https://neetjs.github.io/demo/#tutorial_case_nt_if)

#### nt-repeat

nt-repeat可以用于循环生成相同HTML结构的内容，它支持两种语法：

```html
<p nt-repeat="variable as key : value"></p>
<p nt-repeat="variable as value"></p>
```

其中，variable是要遍历的变量，key是遍历中对象属性名/数组角标（第二种语法中忽略了key），value是遍历中每项元素的值。nt-repeat的结构类似于编程语言中的以下代码结构：

JavaScript:
```javascript
var variable = [...];
for (var key in variable) {
    var value = variable[key];
    ...
}
```

Java:
```java
Map<String, Object> variable = ...;
for (String key : variable.keySet()) {
    Object value = variable.get(key);
    ...
}
```

PHP:
```php
$variable = [...];
foreach ($variable as $key => $value) {
    ...
}
```

以下是一个简单的例子：

```html
<div nt-class="org-neetjs-demo-hello">
<div nt-body>
    <table>
        <thead>
            <tr><th>Seq.</th><th>Name</th><th>Tel.</th></tr>
        </thead>
        <tbody>
            <tr nt-repeat="staffs as idx : row">
                <td nt-html="idx"></td>
                <td nt-html="row.name"></td>
                <td nt-html="row.tel"></td>
            </tr>
        </tbody>
    </table>
</div>
</div>
<script type="text/javascript">
$(function () {
    $.neetjs.loadFromBody();
    $('body').ntInject({
        'class': 'org-neetjs-demo-hello',
        'data': {'staffs': [
            {'name': 'Staff A', 'tel': '11111111'},
            {'name': 'Staff B', 'tel': '11112222'}
        ]}
    });
});
</script>
```

那么结果将是：

```html
...
<body>
    <table>
        <thead>
            <tr><th>Seq.</th><th>Name</th><th>Tel.</th></tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>Staff A</td>
                <td>11111111</td>
            </tr>
            <tr>
                <td>2</td>
                <td>Staff B</td>
                <td>11112222</td>
            </tr>
        </tbody>
    </table>
</body>
...
```

[亲自试一下](https://neetjs.github.io/demo/#tutorial_case_nt_repeat_0)

此外，我们还在实例系统中准备了更多例子：

[以“as key : value”方式遍历对象](https://neetjs.github.io/demo/#tutorial_case_nt_repeat_1)

[以“as key : value”方式遍历数组](https://neetjs.github.io/demo/#tutorial_case_nt_repeat_0)

[以“as value”方式遍历对象](https://neetjs.github.io/demo/#tutorial_case_nt_repeat_2)

[以“as value”方式遍历数组](https://neetjs.github.io/demo/#tutorial_case_nt_repeat_3)

---

## 进阶教程

在本部分教程中您将学会：
* 如何控制类所依赖的html头部资源。
* NeetJS有哪些进阶的渲染属性及如何使用它们。
* 如何组合使用多种渲染属性。
* 如何自定义NeetJS类装载器实现类的自动加载。
* 如何借助AJAX进行页面的动态更新。

---

### nt-head详解

在教程一开始的地方，我们提到了nt-head可以用于指定需要被加载到head标签的资源，例如，某个类需要引入若干项资源：

```html
<div nt-class="org-neetjs-demo-hello">
<div nt-head>
    <link rel="stylesheet" type="text/css" href="/res/bootstrap.min.css" />
    <script type="text/javascript" src="/res/jquery.min.js"></script>
    <script type="text/javascript" src="/res/bootstrap.min.js"></script>
</div>
<div nt-body>
    ...
</div>
</div>
```

当类被**加载**时，NeetJS会将类中nt-head下所有资源加载到head标签中：

```html
<html>
<head>
    <link rel="stylesheet" type="text/css" href="/res/bootstrap.min.css" />
    <script type="text/javascript" src="/res/jquery.min.js"></script>
    <script type="text/javascript" src="/res/bootstrap.min.js"></script>
</head>
<body>
    ...
</body>
</html>
```

为了避免同一个资源被重复加载，在编写nt-head中资源时，可以用“nt-resource-id”为资源附上一个资源标识符，NeetJS在加载类时便不会把相同标识符的资源加载到head中，即使它们并不完全相同。

NeetJS类定义：

```html
<div nt-class="org-neetjs-demo-hello">
<div nt-head>
    <link rel="stylesheet" type="text/css" href="/res/bootstrap.min.css" />
    <script type="text/javascript" src="/res/jquery.min.js" nt-resource-id="jquery1"></script>
    <script type="text/javascript" src="/res/bootstrap.min.js"></script>
</div>
<div nt-body>
    ...
</div>
</div>
<div nt-class="org-neetjs-demo-hello2">
<div nt-head>
    <script type="text/javascript" src="/javascript/jquery.js" nt-resource-id="jquery1"></script>
</div>
<div nt-body>
    ...
</div>
</div>
```

加载后的结果（hello2中的jquery没有被加载）：

```html
<html>
<head>
    <link rel="stylesheet" type="text/css" href="/res/bootstrap.min.css" />
    <script type="text/javascript" src="/res/jquery.min.js" nt-resource-id="jquery1"></script>
    <script type="text/javascript" src="/res/bootstrap.min.js"></script>
</head>
<body>
    ...
</body>
</html>
```

---


### 引入其他类

您可以使用和渲染函数所对应的六种渲染属性，在一个类中引入其它的类，它们的关系如下：
```html
<p nt-replace="{...}"></p><!-- use $(this).ntReplace({...}) -->
<p  nt-inject="{...}"></p><!-- use $(this).ntInject({...})  -->
<p nt-prepend="{...}"></p><!-- use $(this).ntPrepend({...}) -->
<p  nt-append="{...}"></p><!-- use $(this).ntAppend({...})  -->
<p  nt-before="{...}"></p><!-- use $(this).ntBefore({...})  -->
<p   nt-after="{...}"></p><!-- use $(this).ntAfter({...})   -->
```

（实例准备中）

---

### 其他渲染属性

#### nt-eval

nt-eval的功能是在程序上下文中执行一段纯JavaScript代码，当NeetJS渲染到带有nt-eval属性的标签时，便会将该属性的值作为JavaScript代码直接执行，此外，这段代码中的“this”指针将代表该元素本身。


nt-eval可以说是功能最强大的一个渲染属性，任何其它渲染属性的功能都能用nt-eval实现，但我们并不建议您在nt-eval中执行过度复杂的代码，因为这会降低您代码的可维护性。nt-eval的主要用途有两种：
* 通过this指针对本元素做一些数据操作，比如绑定事件、调用第三方库等。
* 更改上下文中变量的值。

包含两种主要用途的例子：

```html
<div nt-class="org-neetjs-demo-hello">
<div nt-body>
    <h1 nt-eval="myName = 'Chen'; myColor = '#F00';">Hello</h1>
    <p nt-eval="$(this).css({'color': myColor});">
        My name is <span nt-html="myName"></span>.
    </p>
</div>
</div>
<script type="text/javascript">
$(function () {
    $.neetjs.loadFromBody();
    $('body').ntInject({'class': 'org-neetjs-demo-hello'});
});
</script>
```

结果将是：

```html
...
<body>
    <h1>Hello</h1>
    <p style="color: #F00">
        My name is <span>Chen</span>.
    </p>
</body>
...
```

[亲自试一下](https://neetjs.github.io/demo/#tutorial_case_nt_eval)

#### nt-remove

nt-remove的功能很简单，NeetJS在渲染处理完带有nt-remove属性的标签后，会移除这一标签，nt-remove属性一般与nt-eval属性一起使用，在执行代码后移除无用的标签：

```html
<div nt-class="org-neetjs-demo-hello">
<div nt-body>
    <p>Before</p>
    <p nt-eval="console.log('debug');" nt-remove></p>
    <p>After</p>
</div>
</div>
<script type="text/javascript">
$(function () {
    $.neetjs.loadFromBody();
    $('body').ntInject({'class': 'org-neetjs-demo-hello'});
});
</script>
```

结果将是：

```html
...
<body>
    <p>Before</p>
    <p>After</p>
</body>
...
```

（实例准备中）
