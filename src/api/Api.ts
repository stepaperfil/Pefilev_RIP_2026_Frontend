/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SerializerEngineer {
  full_name?: string;
  id?: number;
  login?: string;
}

export interface SerializerLifeCycleStage {
  creator_id?: number;
  description?: string;
  id?: number;
  image_url?: string;
  price_per_unit?: number;
  stage_position?: number;
  title?: string;
  video_url?: string;
}

export interface SerializerLifeCycleStageFeedItem {
  description?: string;
  id?: number;
  image_url?: string;
  is_liked?: number;
  likes_count?: number;
  price_per_unit?: number;
  stage_position?: number;
  title?: string;
  video_url?: string;
}

export interface SerializerLifeCycleStageListItem {
  id?: number;
  image_url?: string;
  is_mine?: number;
  likes_count?: number;
  price_per_unit?: number;
  title?: string;
}

export interface SerializerLikeLifeCycleStageRequest {
  like: 0 | 1;
}

export interface SerializerLoginEngineerRequest {
  login: string;
  password: string;
}

export interface SerializerLoginEngineerResponse {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
}

export interface SerializerPublishLifeCycleStageRequest {
  description: string;
  /** @min 0 */
  price_per_unit: number;
  /** @min 1 */
  stage_position: number;
}

export interface SerializerRegisterEngineerRequest {
  /** @maxLength 150 */
  full_name: string;
  /**
   * @minLength 3
   * @maxLength 100
   */
  login: string;
  /**
   * @minLength 6
   * @maxLength 72
   */
  password: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8080",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance
      .request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type ? { "Content-Type": type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      })
      .then((response) => response.data);
  };
}

/**
 * @title TCO API
 * @version 1.0
 * @baseUrl http://localhost:8080
 * @contact
 *
 * Веб-сервис расчёта стоимости владения активом: этапы жизненного цикла и пользователи.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags engineers
     * @name EngineersCreate
     * @summary Регистрация пользователя
     * @request POST:/api/engineers
     */
    engineersCreate: (
      request: SerializerRegisterEngineerRequest,
      params: RequestParams = {},
    ) =>
      this.request<SerializerEngineer, void>({
        path: `/api/engineers`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Проверяет логин и пароль и возвращает JWT для заголовка Authorization: Bearer <token>.
     *
     * @tags engineers
     * @name EngineersLoginCreate
     * @summary Аутентификация
     * @request POST:/api/engineers/login
     */
    engineersLoginCreate: (
      request: SerializerLoginEngineerRequest,
      params: RequestParams = {},
    ) =>
      this.request<SerializerLoginEngineerResponse, void>({
        path: `/api/engineers/login`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет текущий JWT в блеклист Redis до окончания срока его действия.
     *
     * @tags engineers
     * @name EngineersLogoutCreate
     * @summary Деавторизация
     * @request POST:/api/engineers/logout
     * @secure
     */
    engineersLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/engineers/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Опубликованные этапы с фильтром по цене за единицу. Доступно гостю.
     *
     * @tags life_cycle_stages
     * @name ListLifeCycleStages
     * @summary Список этапов жизненного цикла
     * @request GET:/api/life_cycle_stages
     */
    listLifeCycleStages: (
      query?: {
        /** Максимальная цена за единицу */
        max_price_per_unit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SerializerLifeCycleStageListItem[], void>({
        path: `/api/life_cycle_stages`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создаёт черновик этапа текущего пользователя, фото и видео загружаются в MinIO.
     *
     * @tags life_cycle_stages
     * @name CreateLifeCycleStage
     * @summary Добавление этапа
     * @request POST:/api/life_cycle_stages
     * @secure
     */
    createLifeCycleStage: (
      data: {
        /** Название */
        title: string;
        /**
         * Изображение
         * @format binary
         */
        image: File;
        /**
         * Видео
         * @format binary
         */
        video: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<SerializerLifeCycleStage, void>({
        path: `/api/life_cycle_stages`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags life_cycle_stages
     * @name GetDraftLifeCycleStage
     * @summary Черновик текущего пользователя
     * @request GET:/api/life_cycle_stages/draft
     * @secure
     */
    getDraftLifeCycleStage: (params: RequestParams = {}) =>
      this.request<SerializerLifeCycleStage, void>({
        path: `/api/life_cycle_stages/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Без id - первый этап ленты, с id - этот этап, с id и next=true - следующий за ним. Доступно гостю.
     *
     * @tags life_cycle_stages
     * @name GetLifeCycleStageFeed
     * @summary Лента этапов
     * @request GET:/api/life_cycle_stages/feed
     */
    getLifeCycleStageFeed: (
      query?: {
        /** ID этапа */
        id?: number;
        /** true - следующий этап */
        next?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SerializerLifeCycleStageFeedItem, void>({
        path: `/api/life_cycle_stages/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Логическое удаление этапа текущего пользователя.
     *
     * @tags life_cycle_stages
     * @name DeleteLifeCycleStage
     * @summary Удаление этапа
     * @request DELETE:/api/life_cycle_stages/{id}
     * @secure
     */
    deleteLifeCycleStage: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/life_cycle_stages/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description like = 1 ставит лайк текущего пользователя, like = 0 снимает его.
     *
     * @tags life_cycle_stages
     * @name LikeLifeCycleStage
     * @summary Лайк этапа
     * @request POST:/api/life_cycle_stages/{id}/like
     * @secure
     */
    likeLifeCycleStage: (
      id: number,
      request: SerializerLikeLifeCycleStageRequest,
      params: RequestParams = {},
    ) =>
      this.request<SerializerLifeCycleStageFeedItem, void>({
        path: `/api/life_cycle_stages/${id}/like`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags life_cycle_stages
     * @name PublishLifeCycleStage
     * @summary Публикация черновика этапа
     * @request PUT:/api/life_cycle_stages/{id}/publish
     * @secure
     */
    publishLifeCycleStage: (
      id: number,
      request: SerializerPublishLifeCycleStageRequest,
      params: RequestParams = {},
    ) =>
      this.request<SerializerLifeCycleStage, void>({
        path: `/api/life_cycle_stages/${id}/publish`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
