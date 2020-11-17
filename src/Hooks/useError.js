/**
 * The use error hook
 */

export const useError = () => {
  const handleGqlError = ({ graphQLErrors }) => {
    graphQLErrors.forEach(({ message, extensions }) => {
      // logout if we have code unauthenticated
      if (extensions.code === 'UNAUTHENTICATED') console.error('User is not authenticated!')
      // notify the message
      else console.error(message);
    });
  };
  const handleError = e => {
    // notify the error
    //console.error(message);
  };
  return [handleGqlError, handleError];
};
