import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import {
  accountType,
  CompteState,
  CustomHttpResponse,
  DetailCompteState,
  Profile,
} from '../interfaces/appstates';
import { Key } from '../enum/key.enum';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../interfaces/User';
import { Compte } from '../interfaces/compte';
import { SettingForm } from '../interfaces/setting';
import { NewPasswordForm } from '../interfaces/newPasswordForm';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly server: string = environment.API_BASE_URL + '/secureapi';
  /**
   * How to install it
   * npm install @auth0/angular-jwt
   */
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}
  /**
   *
   * @param email
   * @param password
   * @returns
   */
  login$ = (email: string, password: string) =>
    <Observable<CustomHttpResponse<Profile>>>this.http
      .post<CustomHttpResponse<Profile>>(
        `${this.server}/login`,
        {
          email,
          password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   * Creation de compte User
   * @param compteForm
   * @returns
   */
  createUserAccount$ = (compteForm: Compte) =>
    <Observable<CustomHttpResponse<CompteState>>>this.http
      .post<CustomHttpResponse<CompteState>>(
        `${this.server}/createAccount`,
        compteForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  profile$ = () =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<CustomHttpResponse<Profile>>(`${this.server}/profile`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *List  de tous les comptes
   * @returns
   */
  comptes$ = () =>
    <Observable<CustomHttpResponse<CompteState>>>(
      this.http
        .get<CustomHttpResponse<CompteState>>(`${this.server}/comptes`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   * Detail du compte
   * @param compte_id
   * @returns
   */
  compte$ = (compte_id: number) =>
    <Observable<CustomHttpResponse<DetailCompteState>>>(
      this.http
        .get<CustomHttpResponse<DetailCompteState>>(
          `${this.server}/compte/${compte_id}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  newAccount$ = () =>
    <Observable<CustomHttpResponse<CompteState>>>(
      this.http
        .get<CustomHttpResponse<CompteState>>(`${this.server}/comptes/new`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *
   * @param roleName
   * @returns
   * Update UserRole
   */
  updateRole$ = (roleName: string) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/update/role/${roleName}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   * update role by admin
   * @param roleName
   * @param idCompte
   * @returns
   */
  updateRoleByAdmin$ = (roleName: string, idCompte: number) =>
    <Observable<CustomHttpResponse<DetailCompteState>>>(
      this.http
        .patch<CustomHttpResponse<DetailCompteState>>(
          `${this.server}/update/role/${roleName}/${idCompte}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *
   * @param settings
   * Update Settings
   * @returns
   */
  updateSetting$ = (settings: SettingForm) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/update/settings`,
          settings
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *
   * @param settings by Admin
   * Update Settings
   * @returns
   */
  updateAccountSettingAdmin$ = (settings: SettingForm) =>
    <Observable<CustomHttpResponse<DetailCompteState>>>(
      this.http
        .patch<CustomHttpResponse<DetailCompteState>>(
          `${this.server}/update/settingsByAdmin`,
          settings
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *
   * @returns
   * if user  need to use MFA
   */
  toggleMfa$ = () =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(`${this.server}/togglemfa`, {})
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   * Update image profile fonctionnality
   * @param formData
   * @returns
   */
  updateImage$ = (formData: FormData) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/update/image`,
          formData
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *
   * @param user
   * @returns
   * Update user information
   */
  update$ = (user: User) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(`${this.server}/update`, user)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   * Fonctionnality to verify the code
   * @param email
   * @param code
   * @returns
   */
  verifyCode$ = (email: string, code: string) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<CustomHttpResponse<Profile>>(
          `${this.server}/verify/code/${email}/${code}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *
   * @param form
   * Update  Password when user is logged in
   * @returns
   */
  updatePassword$ = (form: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/update/password`,
          form
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );
  /**
   *
   * @returns
   *  Functionality if user is still logged in
   */
  isAuthenticated = (): boolean => {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem(Key.TOKEN);

      if (token && !this.jwtHelper.isTokenExpired(token)) {
        return true;
      }
    }
    return false;
  };

  /**
   * Fonctionnality for refresh token
   * @returns
   */
  refreshToken$ = () => <Observable<CustomHttpResponse<Profile>>>this.http
      .get<CustomHttpResponse<Profile>>(`${this.server}/refresh/token`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(Key.REFRESH_TOKEN)}`,
        },
      })
      .pipe(
        tap((response) => {
          const access_token = response.data?.access_token ?? '';
          const refresh_token = response.data?.refresh_token ?? '';
          localStorage.removeItem(Key.TOKEN);
          localStorage.removeItem(Key.REFRESH_TOKEN);
          localStorage.setItem(Key.TOKEN, access_token);
          localStorage.setItem(Key.REFRESH_TOKEN, refresh_token);
        }),
        catchError(this.handleError)
      );

  verify$ = (key: string, type: accountType) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<CustomHttpResponse<Profile>>(
          `${this.server}/verify/${type}/${key}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  resetnewPassword$ = (newPasswordForm: NewPasswordForm) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .put<CustomHttpResponse<Profile>>(
          `${this.server}/new/password`,
          newPasswordForm
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *  Functionnaly for logout
   */
  logOut(): void {
    localStorage.removeItem(Key.TOKEN);
    localStorage.removeItem(Key.REFRESH_TOKEN);
  }

  /**
   * Error Handler fonctionnality
   * @param error
   * @returns
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      console.log(error.error);
      errorMessage = `A client error occured - ${error.error.message}`;
    } else {
      if (error.error.message) {
        errorMessage = error.error.message;
        console.log(error.error.reason);
      } else if (error.error) {
        const errorKeys = Object.keys(error.error);
        if (errorKeys.length > 0) {
          const key = errorKeys[0];
          errorMessage = error.error[key];
          console.log(`${key}: ${error.error[key]}`);
        } else {
          errorMessage = `An error occurred - Error status ${error.status}`;
        }
      } else {
        errorMessage = `An error Occurred - Error status ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }
}
