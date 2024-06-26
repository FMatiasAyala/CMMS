import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Link } from "@nextui-org/react";

export function MenuOpciones({ onEdit, onDelete, funcion1, funcion2 }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
        >
          Open Menu
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem onClick={onEdit}> {funcion1} </DropdownItem>
        <DropdownItem className="text-danger" color="danger" onClick={onDelete}>
          {funcion2}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export function MenuCaso({ onEdit, onDelete, funcion2, funcion3 }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
        >
          Open Menu
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem onClick={onEdit}> {funcion2} </DropdownItem>
        <DropdownItem className="text-danger" color="danger" onClick={onDelete}>
          {funcion3}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}