import {CsGroupService} from '../interface';
import {CsHttpService, CsResponse} from '../../../core/http-service/interface';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../injection-tokens';
import {GroupServiceImpl} from './group-service-impl';
import {GroupEntityStatus, GroupMemberRole, GroupMembershipType} from '../../../models/group';
import {of} from 'rxjs';
import {CsGroupActivityService} from '../activity/interface';

describe('GroupServiceImpl', () => {
    let groupService: CsGroupService;
    const mockHttpService: Partial<CsHttpService> = {};
    const mockApiPath = 'MOCK_API_PATH';
    const mockGroupActivityService: Partial<CsGroupActivityService> = {};

    beforeAll(() => {
        const container = new Container();

        container.bind<CsGroupActivityService>(InjectionTokens.services.group.GROUP_ACTIVITY_SERVICE).toConstantValue(mockGroupActivityService as CsGroupActivityService);
        container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
        container.bind<string>(InjectionTokens.services.group.GROUP_SERVICE_API_PATH).toConstantValue(mockApiPath);
        container.bind<Container>(InjectionTokens.CONTAINER).toConstantValue(container);

        container.bind<CsGroupService>(InjectionTokens.services.group.GROUP_SERVICE).to(GroupServiceImpl).inSingletonScope();

        groupService = container.get<CsGroupService>(InjectionTokens.services.group.GROUP_SERVICE);
    });

    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be able to get an instance from the container', () => {
        expect(groupService).toBeTruthy();
    });

    describe('activityService', () => {
        it('should be able to get an instance of activityService', () => {
            expect(groupService.activityService).toBeTruthy();
        });
    });

    describe('create()', () => {
        it('should be able to create a group with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {
                        groupId: 'SOME_GROUP_ID'
                    }
                };
                return of(response);
            });

            const request = {
                name: 'SOME_NAME',
                membershipType: GroupMembershipType.INVITE_ONLY,
                description: 'SOME_DESCRIPTION'
            };

            groupService.create(request).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST',
                    body: {
                        request
                    }
                }));
                expect(r).toEqual({
                    groupId: 'SOME_GROUP_ID'
                });
                done();
            });
        });
    });

    describe('updateById()', () => {
        it('should be able to update a group with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {};
                return of(response);
            });

            const request = {
                name: 'SOME_NAME',
                membershipType: GroupMembershipType.INVITE_ONLY,
                description: 'SOME_DESCRIPTION',
                status: GroupEntityStatus.INACTIVE
            };

            groupService.updateById('SOME_GROUP_ID', request).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'PATCH',
                    body: {
                        request: {
                            groupId: 'SOME_GROUP_ID',
                            ...request
                        }
                    }
                }));
                done();
            });
        });
    });

    describe('addMembers()', () => {
        it('should be able to add members to a group with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {};
                return of(response);
            });

            const request = {
                members: [
                    {
                        userId: 'SOME_USER_ID',
                        role: GroupMemberRole.ADMIN
                    },
                    {
                        userId: 'SOME_USER_ID_2',
                        role: GroupMemberRole.MEMBER
                    },
                ]
            };

            groupService.addMembers('SOME_GROUP_ID', request).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'PATCH',
                    body: {
                        request: {
                            groupId: 'SOME_GROUP_ID',
                            members: {
                                add: request.members
                            }
                        }
                    }
                }));
                done();
            });
        });
    });

    describe('removeMembers()', () => {
        it('should be able to remove members from a group with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {};
                return of(response);
            });

            const request = {
                userIds: ['SOME_USER_ID', 'SOME_USER_ID_2']
            };

            groupService.removeMembers('SOME_GROUP_ID', request).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'PATCH',
                    body: {
                        request: {
                            groupId: 'SOME_GROUP_ID',
                            members: {
                                remove: request.userIds
                            }
                        }
                    }
                }));
                done();
            });
        });
    });

    describe('updateMembers()', () => {
        it('should be able to update members of a group with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {};
                return of(response);
            });

            const request = {
                members: [
                    {
                        userId: 'SOME_USER_ID',
                        role: GroupMemberRole.ADMIN
                    },
                    {
                        userId: 'SOME_USER_ID_2',
                        role: GroupMemberRole.MEMBER
                    },
                ]
            };

            groupService.updateMembers('SOME_GROUP_ID', request).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'PATCH',
                    body: {
                        request: {
                            groupId: 'SOME_GROUP_ID',
                            members: {
                                edit: request.members
                            }
                        }
                    }
                }));
                done();
            });
        });
    });

    describe('addActivities()', () => {
        it('should be able to add activity to a group with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {};
                return of(response);
            });

            const request = {
                activities: [
                    {
                        id: 'SOME_ID',
                        type: 'SOME_TYPE'
                    },
                    {
                        id: 'SOME_ID_2',
                        type: 'SOME_TYPE'
                    },
                ]
            };

            groupService.addActivities('SOME_GROUP_ID', request).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'PATCH',
                    body: {
                        request: {
                            groupId: 'SOME_GROUP_ID',
                            activities: {
                                add: request.activities
                            }
                        }
                    }
                }));
                done();
            });
        });
    });

    describe('updateActivities()', () => {
        it('should be able to update activites from a group with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {};
                return of(response);
            });

            const request = {
                activities: [
                    {
                        id: 'SOME_ID',
                        type: 'SOME_TYPE'
                    },
                    {
                        id: 'SOME_ID_2',
                        type: 'SOME_TYPE'
                    },
                ]
            };

            groupService.updateActivities('SOME_GROUP_ID', request).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'PATCH',
                    body: {
                        request: {
                            groupId: 'SOME_GROUP_ID',
                            activities: {
                                edit: request.activities
                            }
                        }
                    }
                }));
                done();
            });
        });
    });

    describe('removeActivities()', () => {
        it('should be able to remove activities of a group with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {};
                return of(response);
            });

            const request = {
                activityIds: ['SOME_ID', 'SOME_ID_2']
            };

            groupService.removeActivities('SOME_GROUP_ID', request).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'PATCH',
                    body: {
                        request: {
                            groupId: 'SOME_GROUP_ID',
                            activities: {
                                remove: request.activityIds
                            }
                        }
                    }
                }));
                done();
            });
        });
    });

    describe('getById()', () => {
        it('should be able to get a group with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {}
                };
                return of(response);
            });

            groupService.getById('SOME_GROUP_ID').subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET'
                }));
                done();
            });
        });

        it('should be able to get a group with members only using appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {}
                };
                return of(response);
            });

            groupService.getById('SOME_GROUP_ID', {includeMembers: true}).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                    parameters: {
                        fields: 'members'
                    }
                }));
                done();
            });
        });

        it('should be able to get a group with activities only using appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {}
                };
                return of(response);
            });

            groupService.getById('SOME_GROUP_ID', {includeActivities: true}).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                    parameters: {
                        fields: 'activities'
                    }
                }));
                done();
            });
        });

        it('should be able to get a group with activities and members using appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {}
                };
                return of(response);
            });

            groupService.getById('SOME_GROUP_ID', {includeActivities: true, includeMembers: true}).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                    parameters: {
                        fields: 'members,activities'
                    }
                }));
                done();
            });
        });
    });

    describe('search()', () => {
        it('should be able to search groups of a user with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {
                        group: []
                    }
                };
                return of(response);
            });

            const request = {
                filters: {
                    userId: 'SOME_USER_ID'
                }
            };

            groupService.search(request).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST',
                    body: {
                        request
                    }
                }));
                done();
            });
        });

        it('should sort groups with order -> groups where user is admin, other groups -> ordered by recent first', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {
                        group: [
                            {
                                'id': 'c3e55271-8dc1-421e-b330-98399a22ac18',
                                'name': 'Report course',
                                'description': '',
                                'status': 'active',
                                'membershipType': 'moderated',
                                'activities': [{'id': 'do_2130654356933754881407', 'type': 'Course'}],
                                'createdOn': '2020-07-16 12:22:45:719+0000',
                                'createdBy': 'ca828836-ebec-4c7a-a6e7-393692ac0549',
                                'updatedOn': '2020-07-16 12:23:33:615+0000',
                                'updatedBy': 'ca828836-ebec-4c7a-a6e7-393692ac0549',
                                'members': null,
                                'memberRole': 'admin'
                            },
                            {
                                'id': 'cf3b680e-01da-4a81-a39c-da74c1202ab1',
                                'name': 'Managed user group',
                                'description': '',
                                'status': 'active',
                                'membershipType': 'moderated',
                                'activities': [],
                                'createdOn': '2020-07-16 08:54:45:061+0000',
                                'createdBy': 'ca828836-ebec-4c7a-a6e7-393692ac0549',
                                'updatedOn': '2020-07-16 09:05:40:622+0000',
                                'updatedBy': 'ca828836-ebec-4c7a-a6e7-393692ac0549',
                                'members': null,
                                'memberRole': 'admin'
                            },
                            {
                                'id': 'dcbb4d49-f3be-4ffd-8de9-d09a452ea4c1',
                                'name': 'Test 396',
                                'description': '',
                                'status': 'active',
                                'membershipType': 'moderated',
                                'activities': [],
                                'createdOn': '2020-07-17 10:05:25:939+0000',
                                'createdBy': '9f9766d3-b054-41e0-af50-85a7c556863c',
                                'updatedOn': '2020-07-16 10:11:33:240+0000',
                                'updatedBy': '9f9766d3-b054-41e0-af50-85a7c556863c',
                                'members': null,
                                'memberRole': 'member'
                            },
                            {
                                'id': 'e52a937a-02dd-4d14-903f-85febc76333f',
                                'name': 'Logged in users',
                                'description': '',
                                'status': 'active',
                                'membershipType': 'moderated',
                                'activities': [{'id': 'do_21303485870433894411338', 'type': 'Course'}],
                                'createdOn': '2020-07-16 09:12:47:833+0000',
                                'createdBy': '9f9766d3-b054-41e0-af50-85a7c556863c',
                                'updatedOn': '2020-07-16 10:03:22:887+0000',
                                'updatedBy': '9f9766d3-b054-41e0-af50-85a7c556863c',
                                'members': null,
                                'memberRole': 'admin'
                            },
                            {
                                'id': 'ee854e1c-4e66-4ca3-a375-593b002c7f27',
                                'name': 'Manage user with admin role',
                                'description': '',
                                'status': 'active',
                                'membershipType': 'moderated',
                                'activities': [{'id': 'do_2130654356933754881407', 'type': 'Course'}],
                                'createdOn': '2020-07-16 09:06:06:590+0000',
                                'createdBy': 'ca828836-ebec-4c7a-a6e7-393692ac0549',
                                'updatedOn': '2020-07-16 12:29:54:511+0000',
                                'updatedBy': 'ca828836-ebec-4c7a-a6e7-393692ac0549',
                                'members': null,
                                'memberRole': 'admin'
                            },
                            {
                                'id': 'dcbb4d49-f3be-4ffd-8de9-d09a452ea4c1',
                                'name': 'Test 396',
                                'description': '',
                                'status': 'active',
                                'membershipType': 'moderated',
                                'activities': [],
                                'createdOn': '2020-07-16 10:05:25:939+0000',
                                'createdBy': '9f9766d3-b054-41e0-af50-85a7c556863c',
                                'updatedOn': '2020-07-16 10:11:33:240+0000',
                                'updatedBy': '9f9766d3-b054-41e0-af50-85a7c556863c',
                                'members': null,
                                'memberRole': 'member'
                            }
                        ]
                    }
                };
                return of(response);
            });

            const request = {
                filters: {
                    userId: 'SOME_USER_ID'
                }
            };

            groupService.search(request).subscribe((groups) => {
                expect(groups.map((g) => g.memberRole + '-' + g.createdOn)).toEqual([
                    'admin-2020-07-16 12:22:45:719+0000',
                    'admin-2020-07-16 09:12:47:833+0000',
                    'admin-2020-07-16 09:06:06:590+0000',
                    'admin-2020-07-16 08:54:45:061+0000',
                    'member-2020-07-17 10:05:25:939+0000',
                    'member-2020-07-16 10:05:25:939+0000'
                ]);
                done();
            });
        });
    });

    describe('deleteById()', () => {
        it('should be able to delete a group with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {};
                return of(response);
            });

            groupService.deleteById('SOME_GROUP_ID').subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'PATCH',
                    body: {
                        request: {
                            groupId: 'SOME_GROUP_ID',
                            status: GroupEntityStatus.INACTIVE
                        }
                    }
                }));
                done();
            });
        });
    });
});
