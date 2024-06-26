import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownTrigger, Dropdown, Avatar} from "@nextui-org/react";
import logoIcrr from '../assets/images/logoIcrr.jpg';


function BarraNavegacion() {

  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">ICRR - Sistemas</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/">
            Inicio
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/equiposMedicos">
            Equipos
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link isDisabled href="/casosEquipos" color="foreground">
            Impresoras
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown>
          <DropdownTrigger>
            <Avatar
              isBordered 
              color="primary"
              size="md"
              src={logoIcrr}
            />
          </DropdownTrigger>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}


export default BarraNavegacion;
