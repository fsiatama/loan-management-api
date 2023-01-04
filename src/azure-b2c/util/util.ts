import { User } from '../../users/entities/user.entity';
import { CreateAzureB2cDto } from '../dto/create-azure-b2c.dto';
class Util {
  static userDtoToAzureB2cDto(user: User) {
    const userName = user.username.trim().toLowerCase().replace(/\*/g, '');

    const email = user.email.trim().toLowerCase();

    const b2cUser: CreateAzureB2cDto = {
      city: user.city || '-',
      country: user?.country ? user.country.name : '-',
      accountEnabled: true,
      displayName: `${user.name} ${user.lastName}`,
      givenName: user.name,
      mailNickname: userName,
      passwordPolicies: 'DisablePasswordExpiration, DisableStrongPassword',
      passwordProfile: {
        password: user.password,
        forceChangePasswordNextSignIn: false,
      },
      preferredLanguage: user.langId === 1 ? 'es-ES' : 'en-US',
      surname: user.lastName,
      mobilePhone: user.phone || '-',
      //mail: email,
      extension_8d38b29e7095428ebef627e928b8f7ce_sicexId: `${user.id}`,
      identities: [
        {
          signInType: 'userName',
          issuer: 'sicexapplication.onmicrosoft.com',
          issuerAssignedId: userName,
        },
      ],
      userPrincipalName: `${userName}@sicexapplication.onmicrosoft.com`,
      extension_8d38b29e7095428ebef627e928b8f7ce_useMfa:
        user.useMfa === true ? true : false,
    };

    return b2cUser;
  }
}

export default Util;
