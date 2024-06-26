import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Button } from "@nextui-org/react";


export function Panel({ children }) {


  return (
    <Card>
      <CardHeader >
      </CardHeader>
      <Divider />
      <CardBody>
        {children}
      </CardBody>
      <Divider />
      <CardFooter>
      </CardFooter>
    </Card>
  );
}
