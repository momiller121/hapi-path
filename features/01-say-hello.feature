Feature: Politely greet guests even if we don't know their name.

    As an end user of the cool system
    I want to be greeted with consideration
    So that I feel like the API really cares about me

    Background: The API is in a normal operating state
        Given the API is ready and operational

    @complete
    Scenario: Default greeting (for anonymous guests)

        Sometimes people want to be anonymous. When this happens,
        the API should still offer a friendly greeting.

        When I request the main resource without providing my name
        Then I receive an anonymous greeting

    @complete
    Scenario Outline: Custom greeting for a guest who has provided their name

        Generally, people like to be addressed by name. So, when
        we know the name of the guest, will will greet them by name.

        When I request the main resource and provide my name as <name>
        Then I receive an customized greeting which includes my name as <name>

        Examples:
            | name   |
            | Steve  |
            | Ellen  |
            | Noël   |
            | Sørina |
            | Adrián |
            | 语嫣   |
            | 映月   |
            | 小林   |
            | 渡辺   |
