<template>  
<!-- vue3支持在template下有多个子元素 vue2只能有一个 -->
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>

  <div class="test">
    <div>{{number}}</div>
    <div>{{obj}}</div>
    <div>{{book}}</div>
    <div>{{personInfo}}</div>

    <div>carinfo --> {{carInfo}}</div>
    <div style="color:red">{{carInfo.price}}</div>
    <div style="color:blue">{{priceRef}}</div>

    <div>gzistFooRef ===> {{gzistFooRef}}</div>
    <div>gzistFooToRef ===> {{gzistFooToRef}}</div>

    <div class="wrap">
      <div>{{ myShoppingInfo }}</div>
      <div>{{ myShoppingInfo.list }}</div>
    </div>


    <div class="wrap">
      <div>{{ sex }}</div>
      <div>{{ school }}</div>
    </div>

    <div class="wrap">
      <div>{{ count }}</div>
      <div>{{ comp_plusOne }}</div>
    </div>
  

    <button @click="handleClick">点击增加</button>
    <ul>
      <li></li>
    </ul>



  </div>




  <!-- 路由的出口 -->
  <router-view />


</template>



<script>
import { computed, onMounted, reactive, ref, toRef,toRefs, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
export default {
  name: "App",
  props: {    // 接收传递父组件传递过来的参数
    username: {
      type: String,
      required: true
    }
  },

  /* 
    1.setup：入口函数  props就是传入的参数
    在setup中没有this，因为它不会找到组件实例。setup的调用发生在data、computed或methods被解析之前，
    所以它们无法在 setup 中被获取。

    setup有两个参数，第一个是props，用于接收传递的属性对象，可以通过watchEffect监听，
    第二个参数是context,其包含attrs,slots,emit属性
  */
  setup(props,ctx){  
    // console.log(props.username)   



    /*
      2.路由的使用：
      在setup里面没有访问this，所以我们不能再直接访问this.$router或this.$route。
      请调用 useRouter 或 useRoute 函数。
    */
    
    // 全局路由的实例
    const router = useRouter()
    // 获取当前路由信息
    const route = useRoute()
    // console.log(route.path)


    // 3.生命周期函数的使用  现在是回调函数的形式
    // 这些函数接受一个回调，当钩子被组件调用时，该回调将被执行
    // setup是围绕beforeCreate和created生命周期函数运行的，生命周期函数必须写在setup中
    /*
      beforeCreate	      不需要（setup）
      created	            不需要（setup）
      beforeMount	        onBeforeMount
      mounted	            onMounted
      beforeUpdate	      onBeforeUpdate
      updated	            onUpdated
      beforeUnmount	      onBeforeUnmount
      unmounted	          onUnmounted
      errorCaptured	      onErrorCaptured
      renderTracked	      onRenderTracked
      renderTriggered	    onRenderTriggered
      activated	          onActivated
      deactivated	        onDeactivated
    */
    onMounted(()=>{
      // console.log('我是mounted函数')
    })


   
    /*
      4.数据的响应式
        4.1 带 ref 的响应式变量   -- 返回一个具有响应式状态的副本
          (1) ref 接受一个参数值并返回一个响应式且可改变的 ref 对象
          (2) ref 对象拥有一个指向内部值的单一属性 .value  
          (3) 在setup内取值需要使用.value的形式
          (4) setup返回的ref在模板中会自动解开，可以在模板直接使用{{r}}取值
          (5) ref的本质是拷贝，与原始数据无关联性
    
          (6) ref接受一个参数,一般是基本数据类型值（String、Number、Boolean、Undefined、Null）或单值对象。
              如果传入的参数是一个对象，将会调用 reactive 方法进行深层响应转换，此时访问ref中的对象
              会返回Proxy对象，说明是通过reactive创建的。
              
          (7) 引用类型值（Object 、Array）使用reactive
          (8) 通过.value形式取值


        4.2 reactive  -- 返回一个具有响应式状态的副本
          (1) reactive 接收一个普通对象然后返回该普通对象的响应式代理（proxy）
          (2) 需要传递一个对象，否则会抛出异常
          (3) setup返回出去后在模板中只能拿到其对象  
          (4) 返回对象的响应式副本
          (5) 不需要通过.value形式取值
       
      总结：
        reactive和ref都是vue3中用来创建响应式数据的api，作用等同于在vue2中的data，不同的是他们
        使用了ES6的PorxyAPI解决了vue2 defineProperty 无法监听数组和对象新增属性的痛点


        vue 3.0 setup里定义数据时推荐优先使用ref，方便逻辑拆分和业务解耦。

     */

    // 4.1 基本数据类型用ref

    // 传入是一个基本数据类型
    const number = ref(100)  

    // 赋值 
    number.value++

    // 取值 通过.value形式取值
    console.log(number) // { value: 100 }
    console.log(number.value) // 100       


    // 传入一个对象
    const obj = ref({
      a:100,
      b:200
    })

    // 赋值
    obj.value.b = "哈哈哈哈"
    
    // 取值
    console.log(obj)
    console.log(obj.value.b)





    // 4.2 引用数据类型用reactive
    const book = reactive({
      title: 'Vue 3 Guide',
      a:100
    })


    // 当将 ref 分配给 reactive 时，ref 将被自动解包。
    const phoneNumber = ref(124164564)
    const personInfo = reactive({
      adress:"广东省广州市",
      phoneNumber:phoneNumber
    }) 

    console.log(phoneNumber.value === personInfo.phoneNumber )  // true
    

    
    console.log("-------------")

    /*
      5. toRef()
        (1) toRef 可以用来为一个 reactive 对象的属性创建一个 ref
        (2) 接收两个参数：源响应式对象和属性名，返回一个ref数据。

        (3) toRef的本质是引用关系，与原始数据存在关联性
        (4) toRef当数据发生改变时，界面不会自动更新
        (5) 这个 ref 可以被传递并且能够保持响应性
        (6) 获取数据值的时候需要加.value

        应用：
          1.例如使用父组件传递的props数据时，要引用props的某个属性且要保持响应式连接时就很有用。
          2.如果想让响应式数据和以前的数据关联起来，并且更新响应式数据之后还不想更新UI，那么就可以使用




      ref和toRef的区别：
        ref->复制，修改响应式数据不会影响以前的数据
        toRef->引用，修改响应式数据会影响以前的数据

        ref->数据发生改变，界面就会自动更新
        toRef->数据发生改变，界面也不会自动更新

    
    */

    // 情形1
    const carInfo = reactive({
      name:"雷克萨斯",
      price:500,
      id:1000
    })

    // toRef 为reactive对象的属性创建一个响应式的ref
    const priceRef = toRef(carInfo,'price')  // reactive对象,对象中的属性名

    priceRef.value++
    console.log(priceRef.value)  // 501
    carInfo.price++
    console.log(carInfo.price)  // 502


    console.log(" * * * * * * * * ")

    // 情形2
    let gzist = {
      foo:1
    }

    const gzistFooRef = ref(gzist.foo)
    
    console.log(gzist.foo) // 1
    console.log(gzistFooRef)  // RefImpl {__v_isShallow: false, dep: undefined, __v_isRef: true, _rawValue: 1, _value: 1}
    console.log(gzistFooRef.value)  // 1

    gzistFooRef.value++
    console.log("gzist.foo：",gzist.foo)	// 1
    console.log("gzistFooRef.value：",gzistFooRef.value)	// 2


    console.log(" ============== ")

    const gzistFooToRef = toRef(gzist,'foo')
    console.log(gzistFooToRef)	// ObjectRefImpl {_object: {…}, _key: "foo", __v_isRef: true}
    console.log(gzist.foo)	// 1
    console.log(gzistFooToRef.value)	// 1

    gzistFooToRef.value++
    console.log("gzist.foo",gzist)	// 2  会改版原来的对象
    console.log("gzistFooToRef.value",gzistFooToRef.value)	// 2



     console.log(" ~~~~~~~~~~toRefs~~~~~~~~~~~~~ ")


    /*
      【推荐】toRefs -- 解构响应式对象数据
        toRefs() 函数可以将 reactive() 创建出来的响应式对象，转换为普通的对象，相当于变成一个个的ref()
      
        优点：在定义响应式的时候直接使用reactive，最后返回出去的时候用toRefs将他们转换为单独的ref

    */

    /* 常规使用 
      示例：myShoppingInfo就是一个对象，里面是有关系的，将用于一个地方，那么在return出去的时候
          就像以前一样直接写 return { myShoppingInfo } 就行了 那么在模板中他就是以一个对象的形式访问
    */
    const myShoppingInfo = reactive({
      name: "trist",
      age: 22,
      sex: "boy",
      info:{
        xinxi:"信息"
      },
      isMan:true,
      list:[10,20,30,40],
      dataSourceList:[
        {
          acc:203
        },
        {
          boy:"54545d"
        }
      ]
    })
    console.log(myShoppingInfo)

    

    // 对数组赋值
    myShoppingInfo.list[4] = 50   // 他是可以的 vue2是不可以的
    myShoppingInfo.list.push(100) // 用以前的方法也是可以的

    // 获取
    console.log(myShoppingInfo.list)  // Proxy {0: 10, 1: 20, 2: 30, 3: 40, 4: 50}
    // 遍历
    myShoppingInfo.list.forEach(item=>console.log(item))  // 10 20 30 40 50

   

   console.log(" # - # - -  - toRefs + reactive - - - #- #- # ")

    


    /*
      使用toRefs:
        (1)可以将他们从对象中都抽离出来变成一个个的refs 那么在使用的时候就不用这么麻烦
        (2)我们使用reactive定义复杂数据类型的响应式数据，用一个总对象的写法，把所需的data数据写在其中
        (3)在setup中，若我们需要操作data内的数据，我们通过data进行访问
        (4)使用（...）展开运算符使得定义在大对象内的数据进行解套,便于我们取值,借助toRefs()函数
        可以将reactive()创建出来的响应式对象，转换为普通对象，只不过这个对象上的每个属性节点，
        都是ref()类型的响应式数据，使得响应式对象能进行解构并不丢失响应性
        (5)在return的时候写成 return { ...toRefs(data) } 即可
    */

    // 【推荐】 reactive + toRefs的形式定义响应式变量 因为方便
    const data = reactive({
      date:new Date().toLocaleDateString(),
      idNumber:440145452484,
      location:"广东省广州市",
      temp:"26度",
      songList:["001.mp4","002.mp4","003.mp4"],
      school:{
        name:"东河中学",
        build:"2001年",
        isHighSchool:true,
        class:[
          {
            name:"高三一班"
          },
          {
            name:"高三二班"
          }
        ]
      }
    })

    // 在setup中，若我们需要操作data内的数据，我们通过data进行访问
    // 取值
    console.log(data)
    console.log(data.school)




    


    // 6.watch
    // 侦听一个数据
    let num1 = ref(1)
    watch(num1,(count,prevCount)=>{
      console.log('监听a的变化', num1.value, '新值', count, '旧值', prevCount);
    }) 

    // 7.watchEffect
    // watchEffect 监听器的升级版本，立即执行传入的一个函数，
    // 并响应式追踪其依赖，并在其依赖变更时重新运行该函数。

    let obj1 = reactive({num:10})
    setTimeout(()=> {
      obj1.num++
    },1000)

    watchEffect(() => {
      console.log(obj1.num)		// 10  // 11
    });



    // 8.computed
    // computde返回值为一个ref的实例，能在模板中自动解开
    // 【只读】接受一个 getter 函数，并根据 getter 的返回值返回一个不可变的响应式 ref 对象。
    const count = ref(1)
    const comp_plusOne = computed(()=>{
      return count.value+1
    })
    console.log(comp_plusOne)



    // 9.methods 方法的写法 
    // 定义方法函数，如在外部template中需要触发该方法，记得return出去
    const handleClick = ()=>{
      myShoppingInfo.dataSourceList[1].boy=999
      // console.log(myShoppingInfo.dataSourceList)  // 能检测到


      num1.value++

    }
  
    
    // 将setup返回的所有内容都暴露给组件的其余部分(计算属性、方法、生命周期钩子等等)以及组件的模板。
    // 在setup函数中定义的变量和方法最后都是需要 return 出去的 不然无法再模板中使用
    return {
      number,
      book,
      personInfo,
      carInfo,
      priceRef,
      obj,
      gzistFooRef,
      gzistFooToRef,
      myShoppingInfo,
      ...toRefs(data),
      num1,
      obj1,
      handleClick,
      count,
      comp_plusOne,  

    }

  },
  components: { 
    /**
     * 新闻的API接口
     *  https://blog.csdn.net/xm1037782843/article/details/103388228
     *  https://blog.csdn.net/QAIN_/article/details/115909775
     * 
     * 做搜索列表的接口
     *  搜索时的接口：https://www.toutiao.com/2/article/search_sug/?keyword=
     *  点击后详情的接口：https://so.toutiao.com/search?dvpf=pc&source=sug&keyword=
     *  
     */
  },
};
</script>

<style lang="less">
@import "assets/css/reset.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.wrap{
  border: 1px solid #ddd;
  padding: 10px;
  color:red
}




</style>
