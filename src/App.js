import React from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css'

import Hero from './components/Hero'
// import Era from './components/Era'
// import Acquire from './components/Acquire'
// import Claim from './components/Claim'
// import Whitepaper from './components/Whitepaper'
// import Footer from './components/Footer'

import  { BreakpointProvider } from 'react-socks';

const { Content } = Layout;

const App = (props) => {

  return (
  	<BreakpointProvider>
	    <Layout>
	      <Content style={{background: "#fff", paddingRight:40}}>
	        <Hero />
          {/* <Era />
          <Acquire />
          <Claim />
	        <Whitepaper /> 
          <Footer /> */}
	      </Content>
	    </Layout>
    </BreakpointProvider>
  );
}

export default App;