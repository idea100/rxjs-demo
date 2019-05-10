# react hooks
#### 1、在react hooks出现之前，我们写react组件主要主要分为无状态组件(Function)和有状态组件(Class)

```js
function Example(props) {
  return (
    <div>
      <p>You clicked {props.count} times</p>
      <button onClick={() => props.setCount(props.count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
* 这是一个无状态组件，接收来自父组件props传递过来的数据，使用{props.count}的表达式把props塞到模板里面，点击button会触发props.setCount方法，其所有的渲染逻辑都依赖于props，自身不维护任何状态也没有一个维护状态的机制(在hook出现之前)；



```js
import React, { Component } from 'react';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            count: 0
        };

        this.setCount = this.setCount.bind(this);
    }

    setCount() {
        this.setState({ count: this.state.count + 1 })
    }

    render() {
        return (
            <div>
                <p>You clicked {this.state.count} times</p>
                <button onClick={this.setCount}>
                    Click me
                </button>
            </div>
        )
    }
}
```
* 这是一个有状态组件，从代码中我们可以看到加了状态处理逻辑之后，整个组件看起来就变得复杂多了；
* 首先这个组件需要继承React.Component或者React.PureComponent;
* 然后在constructor里面定义好状态管理容器this.state = { count: 0 };
* 接着需要将setCount方法的作用域强制绑定到当前组件中(让人头疼的this问题)；
* 最后是一个render函数，在render函数中渲染逻辑跟Example组件的渲染逻辑没有多大区别，区别在于Example组件的渲染逻辑依赖于prop，在render函数里面的渲染逻辑依赖于当前组件的状态容器this.state；



#### 2、react hook出现之后可以让函数组件也可以使用React state了
```js
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
* useState是react自带的一个hook函数，它的作用就是用来声明状态变量。
* useState这个函数接收的参数是我们的状态初始值（initial state），这里的初始值可以是任意类型的数据: string、number、object、array等等。
* 它返回了一个数组，这个数组的第[0]项是当前当前的状态值，第[1]项是可以改变状态值的方法函数。
* 在这里我们做的事情其实就是，声明了一个状态变量count，把它的初始值设为0，同时提供了一个可以更改count的函数setCount。


#### 3、如果不使用hook组件的话需要这样来实现
```js
import React, { Component } from 'react';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            count: 0
        };

        this.setCount = this.setCount.bind(this);
    }

    setCount() {
        this.setState({ count: this.state.count + 1 })
    }

    render() {
        return (
            <div>
                <p>You clicked {this.state.count} times</p>
                <button onClick={this.setCount}>
                    Click me
                </button>
            </div>
        )
    }
}
```
* 我们用class来创建react组件时，有一件很麻烦的事情，就是this的指向问题。为了保证this的指向正确，我们要经常写这样的代码：`this.setCount = this.setCount.bind(this)`，
* 或者是这样的代码：`<button onClick={() => this.setCount(this.state.count + 1)}>`。
* 或者使用箭头函数 `setCount = () => { this.setState({ count: this.state.count + 1 }) }`
* 一旦我们不小心忘了绑定this，各种bug就随之而来，很麻烦。
* 我们还需要对es6的class非常精通。



#### 4、useEffect 与 function组件的生命周期
```js
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
* 我们写的有状态组件(class)，通常会产生很多的副作用（side effect），比如发起ajax请求获取数据，添加一些监听的注册和取消注册，手动修改dom等等。
* 我们之前都把这些副作用的函数写在生命周期函数钩子里，比如componentDidMount，componentDidUpdate和componentWillUnmount。而现在的useEffect就相当与这些声明周期函数钩子的集合体。它以一抵三。
* 同时，由于hooks可以反复多次使用，相互独立。所以我们合理的做法是，给每一个副作用一个单独的useEffect钩子。这样一来，这些副作用不再一股脑堆在生命周期钩子里，代码变得更加清晰。
* useEffect让组件的生命周期变得更加简洁，不用去区分是第一次渲染完成还是组件更新；只用关心React组件需要在渲染后执行哪些操作。


如果使用class组件需要这样来实现
```js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```
* componentDidMount是组件第一次渲染完成的回调；componentDidUpdate组件更新时候的回调；
* 这两个回调执行的都是同样的逻辑，设置document.title;




useEffect 同样适用于一些带有复杂的生命周期的组件
```js
import React, { useState, useEffect } from 'react';

export default function Example() {
    const [count, setCount] = useState(0);

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // Update the document title using the browser API
        const $btn = document.getElementById('button');
        const showCount = function () {
            alert(`the count value is ${count}`);
        };

        $btn.addEventListener('click', showCount);

        return function cleanup() {
            $btn.removeEventListener('click', showCount);
        }
    });

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
            <button id="button">show count</button>
        </div>
    );
}
```
* 在这里我们为`id="button"`的button添加了一个click事件，点击之后展示count的值，因为count的值会发生改变，所以每次组件渲染之后需要解绑原来的click事件，然后重新为button添加新的click事件；
* 为什么不直接 `<button id="button" onClick={() => alert(this.count)}>show count</button>`，这里只是对观察者模式的一个非常简单的抽象，$btn可以理解为外部的watcher.
* 我们在使用useEffect这个hook的时候返回了一个cleanup函数，这里执行的顺序是这样的：组件渲染 => 执行useEffect里面的函数 => 组件再次渲染 => 执行上次useEffect返回的cleanup函数 => 执行useEffect里面的函数
* useEffect(fn, [...]) useEffect函数还接收第二个参数，第二个参数是一个数组，如果数组里面有一个值发生改变才会触发useEffect，如果第二个参数不传，则组件渲染完成之后都会执行useEffect.



#### 5、在react hook出现之前我们是如何复用react的状态逻辑的呢

在我们开发中常常会遇到一些状态复用的时候，试想一下这样的一个场景，你在天猫购买商品的页面，每个页面的UI都是不一样的，但是每个页面的交互大部分是一样的（编辑商品数量、添加到购物车）,这里每个页面的UI展示逻辑我们可以抽象成一个个纯UI组件，但是每个页面的交互逻辑都很类似，我们不可能在每个组件都写一遍交互逻辑的代码，因为万一交互有改动，你可能需要修改很多组件，所以我们需要复用这些交互逻辑。

第一种  高阶组件的方式

```js
import React, { Component } from 'react';

// 这是一个简单的购买衣服的页面
function Example1(props) {
    return (
        <div>
            <p>这个是购买衣服的页面</p>
            <p>你需要购买的数量是：{props.count}</p>
            <button onClick={() => props.setCount(props.count + 1)}>
                添加
            </button>
            <button onClick={() => props.setCount(props.count - 1)}>
                减少
            </button>
        </div>
    );
}

// 这是一个简单的购买电脑的页面
function Example2(props) {
    return (
        <div>
            <p>这个是购买电脑的页面</p>
            <p>你需要购买的数量是：{props.count}</p>
            <button onClick={() => props.setCount(props.count + 1)}>
                添加
            </button>
            <button onClick={() => props.setCount(props.count - 1)}>
                减少
            </button>
        </div>
    );
}

// 高阶组件 为TargetComponent添加编辑商品数量的逻辑
const withShoppingCard = TargetComponent => {
    class ShoppingCard extends Component {
        state = {
            count: 0
        };

        setCount = count => {
            this.setState({ count })
        };

        render() {
            return (<TargetComponent count={this.state.count} setCount={this.setCount}/>)
        }
    }

    return ShoppingCard;
};

// 经过withShoppingCard包裹的高阶组件
const HocExample1 = withShoppingCard(Example1);
const HocExample2 = withShoppingCard(Example2);

export default class App extends Component {
    render() {
        const Example = 1 === 2 ? HocExample1 : HocExample2;

        return (
            <Example/>
        );
    }
}
```


第二种render props的方式
```js
import React, { Component } from 'react';

// 这是一个简单的购买衣服的页面
function Example1(props) {
    return (
        <div>
            <p>这个是购买衣服的页面</p>
            <p>你需要购买的数量是：{props.count}</p>
            <button onClick={() => props.setCount(props.count + 1)}>
                添加
            </button>
            <button onClick={() => props.setCount(props.count - 1)}>
                减少
            </button>
        </div>
    );
}

// 这是一个简单的购买电脑的页面
function Example2(props) {
    return (
        <div>
            <p>这个是购买电脑的页面</p>
            <p>你需要购买的数量是：{props.count}</p>
            <button onClick={() => props.setCount(props.count + 1)}>
                添加
            </button>
            <button onClick={() => props.setCount(props.count - 1)}>
                减少
            </button>
        </div>
    );
}

// 定义了一个带 编辑商品数量的逻辑 的组件，其渲染逻辑依赖父组件 props.render
class Shell extends Component {
    state = {
        count: 0
    };

    setCount = count => {
        this.setState({ count })
    };

    render() {
        return (
            <div>
                {this.props.render({
                    count: this.state.count,
                    setCount: this.setCount
                })}
            </div>
        )
    }
}

export default class App extends Component {
    render() {
        const Example = 1 === 2 ? Example1 : Example2;

        return (
            <Shell
                render={props => <Example {...props}/>}
            />);
    }
}
```


使用react hooks的方式
```js
import React, { useState } from 'react';

// 这是一个简单的购买衣服的页面
function Example1(props) {
    return (
        <div>
            <p>这个是购买衣服的页面</p>
            <p>你需要购买的数量是：{props.count}</p>
            <button onClick={() => props.setCount(props.count + 1)}>
                添加
            </button>
            <button onClick={() => props.setCount(props.count - 1)}>
                减少
            </button>
        </div>
    );
}

// 这是一个简单的购买电脑的页面
function Example2(props) {
    return (
        <div>
            <p>这个是购买电脑的页面</p>
            <p>你需要购买的数量是：{props.count}</p>
            <button onClick={() => props.setCount(props.count + 1)}>
                添加
            </button>
            <button onClick={() => props.setCount(props.count - 1)}>
                减少
            </button>
        </div>
    );
}

export default function App() {
    const [count, setCount] = useState(0);
    const Example = 1 === 2 ? Example1 : Example2;

    return (
        <Example count={count} setCount={setCount}/>
    );
}
```
