import { rest } from 'msw';

// endpoints
import {
  AUTH_GW_BASE_URL,
  TESTBED_API_BASE_URL,
  USERS_API_BASE_URL,
} from '../../api/endpoints';
import { ConsentDataSource } from '../../constants/ConsentDataSource';

const mockAuthUser = {
  idToken: 'test-token',
  expiresAt: '2022-11-18T12:22:35.000Z',
  profileData: {
    userId: '123245345345345',
    email: 'test@tester.testbed.fi',
    profile: {
      email: 'test@tester.testbed.fi',
      sub: '456456456365',
      name: '123123123123',
    },
  },
};

const mockUser = {
  id: '12312-123123-asdasd',
  firstName: 'Donald',
  lastName: 'Duck',
  address: '1313 Webfoot Street, Duckburg',
  jobTitles: ['Developer'],
  regions: ['01', '02'],
  created: '2022-10-12T12:05:46.6262126Z',
  modified: '2022-10-12T12:05:46.6262127Z',
  immigrationDataConsent: true,
};

/**
 * msw handlers to override HTTP request for testing
 */
export const handlers = [
  rest.post(
    `${AUTH_GW_BASE_URL}/auth/openid/testbed/login-request`,
    (req, res, ctx) => {
      return res(ctx.json(mockAuthUser));
    }
  ),
  rest.post(
    `${AUTH_GW_BASE_URL}/auth/openid/testbed/user-info-request`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          name: '1231232asdasdADasd2',
          sub: '1231232asdasdADasd2',
        })
      );
    }
  ),
  rest.post(
    `${AUTH_GW_BASE_URL}/consents/testbed/consent-check`,
    async (req, res, ctx) => {
      const { dataSources } = await req.json();
      const consentToken = dataSources[0].consentToken;
      const result = consentToken
        ? [
            {
              dataSource: ConsentDataSource.USER_PROFILE,
              consentStatus: 'consentGranted',
              consentToken: consentToken,
            },
          ]
        : [
            {
              dataSource: ConsentDataSource.USER_PROFILE,
              consentStatus: 'verifyConsent',
              redirectUrl: 'skip-redirect-url',
            },
          ];
      return res(ctx.json(result));
    }
  ),
  rest.get(`${USERS_API_BASE_URL}/identity/verify`, (req, res, ctx) => {
    return res(
      ctx.json({
        id: mockUser.id,
        created: mockUser.created,
        modified: mockUser.modified,
      })
    );
  }),
  rest.post(
    `${TESTBED_API_BASE_URL}/testbed/productizers/user-profile`,
    (req, res, ctx) => {
      return res(ctx.json(mockUser));
    }
  ),
  rest.get(`${USERS_API_BASE_URL}/user/consents`, (req, res, ctx) => {
    return res(ctx.json({ immigrationDataConsent: true }));
  }),
  rest.patch(`${USERS_API_BASE_URL}/user`, (req, res, ctx) => {
    return res(ctx.json(mockUser));
  }),
  rest.get(`${USERS_API_BASE_URL}/code-sets/countries`, (req, res, ctx) => {
    return res(
      ctx.json([
        {
          displayName: 'Aruba',
          englishName: 'Aruba',
          id: 'AW',
          nativeName: '',
          threeLetterISOCode: 'ABW',
          twoLetterISOCode: 'AW',
        },
      ])
    );
  }),
  rest.get(
    `${USERS_API_BASE_URL}/code-sets/occupations-flat`,
    (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: '0',
            name: {
              en: 'Armed forces',
            },
          },
        ])
      );
    }
  ),
  rest.get(`${USERS_API_BASE_URL}/code-sets/languages`, (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: '',
          displayName: 'Invariant Language (Invariant Country)',
          englishName: 'Invariant Language (Invariant Country)',
          nativeName: 'Invariant Language (Invariant Country)',
          twoLetterISORegionName: 'iv',
          threeLetterISORegionName: 'ivl',
        },
      ])
    );
  }),
  rest.post(
    `${TESTBED_API_BASE_URL}/testbed/productizers/update-user-status-info`,
    (req, res, ctx) => {
      return res(ctx.json({}));
    }
  ),
];
