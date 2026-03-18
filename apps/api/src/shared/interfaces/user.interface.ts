export interface UserEntity {
  id: string;
  email: string;
  roles?: string[];
  permissions?: string[];
}
