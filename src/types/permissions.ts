export enum Permission {
  Read = "r",
  Write = "w",
  Add = "a",
  Trash = "t",
  Link = "l",
  Unlink = "u",
  Share = "s",
  Delete = "d",
  ChangePermissions = "g",
}

export enum PermissionPresets {
  ReadOnly = "r",
  Write = "rwa",
  WriteLink = "rwalu",
  WriteLinkTrash = "rwatlu",
  WriteLinkTrashShare = "rwatslu",
  Admin = "rwsadtlug",
}