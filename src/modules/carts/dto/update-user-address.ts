import { PartialType } from "@nestjs/mapped-types";
import { CreateUserAddressDto } from "./create-user-address";

export class UpdateUserAddressDto extends PartialType(CreateUserAddressDto) {

}