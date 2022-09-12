import 'bootstrap/dist/css/bootstrap.min.css';
// import $ from 'jquery';
// import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { render } from "react-dom";
import App from './frontend/components/App';
import * as serviceWorker from './serviceWorker';
// import Web3Provider from './frontend/NftContext/Web3Provider';
import NftProvider from './frontend/NftContext/NftProvider';

const rootElement = document.getElementById("root");
render( <NftProvider><App /></NftProvider>, rootElement);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();