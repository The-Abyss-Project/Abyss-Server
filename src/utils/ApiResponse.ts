export class ApiResponse {
  status: "success" = "success";
  constructor(
    public statusCode: number,
    public result: number,
    public data: {} | [],
    public message: string
  ) {}
}
