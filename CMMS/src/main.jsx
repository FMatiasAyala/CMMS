import React from 'react'
import ReactDOM from 'react-dom/client'
import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(

    <BrowserRouter>
        <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
        <App />
        </NextThemesProvider>
        </NextUIProvider>
    </BrowserRouter>

)
