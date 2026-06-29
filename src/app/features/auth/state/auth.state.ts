export interface AuthState {
  token: string;
  refreshToken: string;
}

export const initialProductState: AuthState = {
  token: localStorage.getItem('token') ?? '',
  refreshToken: localStorage.getItem('refreshToken') ?? '',
  //https://siva-cs579.medium.com/complete-ngrx-setup-in-angular-standalone-907b7b76ff25
  //https://medium.com/williambastidasblog/most-common-design-patterns-in-angular-what-they-are-and-how-to-apply-them-f0193b85e500
};
