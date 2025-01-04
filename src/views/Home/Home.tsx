import React, {useEffect} from "react";

const Home:React.FC = (data:any) => {
    useEffect(()=> {
        console.log(data)
    }, [data])
    return (
      <>
          <div> Home </div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
      </>
      )

}

// 定义 getServerSideProps 方法
// @ts-ignore
Home.getServerSideProps = async ( {}) => {
    const data = await fetch('http://localhost:5173/api/hello').then((res) => res.json());
    console.log(data);
    
    return {
        props: {
            data,
        },
    };
};

export default Home
